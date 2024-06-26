import { Server, Socket } from 'socket.io';
import { NextFunction, Request, Response } from 'express';
import { authMiddleware } from '../middlewares';
import { IUser, User } from '../models/UserModel';
import {
  IncomingChatMessage,
  OutgoingChatMessage,
} from '../../../shared/types';
import { Conversation } from '../models/ConversationModel';
import { Message } from '../models/MessageModel';

export const chatSocket = (io: Server) => {
  io.engine.use(onlyForHandshake(authMiddleware));

  io.on('connection', (socket) => onConnection(io, socket));
};

const onConnection = async (io: Server, socket: Socket) => {
  const user = socket.request.user as IUser;

  socket.join(`user:${user.id}`);

  // update user status to online
  await User.updateOne(
    {
      _id: user.id,
    },
    {
      isOnline: true,
    },
  );

  console.log(`User ${user.email} connected.`);

  socket.on('message', onChatMessage(user, io, socket));

  socket.on('disconnect', onDisconnect(io, user));

  socket.on('connect_error', (err) => {
    console.log(err);
  });
};

const onDisconnect = (io: Server, user: IUser) => {
  return async () => {
    console.log(`User ${user.email} disconnected.`);

    const sockets = await io.in(`user:${user.id}`).fetchSockets();

    if (sockets.length === 0) {
      // no more active connections for the given user
      // update user status to offline
      await User.updateOne(
        {
          _id: user.id,
        },
        {
          isOnline: false,
        },
      );

      console.log(`User ${user.email} is now offline.`);
    }
  };
};

const onChatMessage = (user: IUser, io: Server, socket: Socket) => {
  return async (msg: IncomingChatMessage) => {
    const createdAt = new Date();

    const conversation = await Conversation.findByIdAndUpdate(
      msg.conversation,
      {
        $set: {
          lastMessage: {
            sender: user.id,
            text: msg.text,
            createdAt,
          },
        },
      },
      { new: true },
    ).populate<{ participants: IUser[] }>('participants');

    if (!conversation) {
      console.log(`Conversation ${msg.conversation} not found.`);
      return;
    }

    await Message.create({
      sender: user.id,
      conversation: msg.conversation,
      text: msg.text,
      createdAt,
    });

    const messageToSend: OutgoingChatMessage = {
      conversation: msg.conversation,
      sender: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      text: msg.text,
      createdAt,
    };

    const sockets = await io.in(`user:${user.id}`).fetchSockets();

    sockets
      .filter((s) => s.id !== socket.id)
      .map((s) => s.emit('message', messageToSend));

    // Get all online participants except the sender
    const onlineParticipants = conversation.participants.filter(
      (participant) => participant.isOnline && participant.id !== user.id,
    );

    onlineParticipants.forEach((participant) => {
      io.to(`user:${participant.id}`).emit('message', messageToSend);
    });
  };
};

const onlyForHandshake = (
  middleware: (req: Request, res: Response, next: NextFunction) => void,
) => {
  return (req: any, res: any, next: any) => {
    const isHandshake = req._query.sid === undefined;

    if (isHandshake) {
      middleware(req, res, next);
    } else {
      next();
    }
  };
};
