import { Server, Socket } from 'socket.io';
import { NextFunction, Request, Response } from 'express';
import { authMiddleware } from '../middlewares';
import { IUser, User } from '../models/UserModel';
import { IncomingChatMessage } from '../../../shared/types';
import { Conversation } from '../models/ConversationModel';

export const chatSocket = (io: Server) => {
  io.engine.use(onlyForHandshake(authMiddleware));

  io.of('/chat').on('connection', (socket) => onConnection(io, socket));
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

  socket.on('chatMessage', onChatMessage(user, io, socket));

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
    // if (msg.isGroup) {
    //   handleGroupMessage(user, msg);
    //   return;
    // }

    await handleDirectMessage(user, msg, io, socket);
  };
};

const handleDirectMessage = async (
  user: IUser,
  msg: IncomingChatMessage,
  io: Server,
  socket: Socket,
) => {
  console.log(
    `User ${user.email} sent message to conversation ${msg.conversationId}: "${msg.message}"`,
  );

  // Fetch the recipients from the conversation
  // const recipient = db.users.find((u) => u.id === msg.to);
  const conversation = await Conversation.findById(msg.conversationId).populate(
    'participants',
  );

  if (!conversation) {
    console.log(`Conversation ${msg.conversationId} not found.`);
    return;
  }

  if (!conversation.participants.length) {
    console.log(`Conversation ${msg.conversationId} has no participants.`);
    return;
  }

  // Save to database
  // db.messages.push({
  //   id: db.messages.length + 1,
  //   timestamp: Date.now(),
  //   sender: user.id,
  //   conversation: msg.conversationId,
  //   text: msg.message,
  // });

  // Filter the sockets in the currentUser's room and send
  // to all except the one sending
  const sockets = await io.in(`user:${user.id}`).fetchSockets();

  sockets
    .filter((s) => s.id !== socket.id)
    .map((s) =>
      s.emit('chatMessage', {
        from: user.id,
        conversationId: user.id,
        message: msg.message,
      }),
    );

  // if (msg.to === user.id) {
  //   return;
  // }
  //
  // // Check if recipient is online
  // if (!recipient.isOnline) {
  //   console.log(`User ${msg.to} is offline.`);
  //   return;
  // }

  // Send message to the recipient
  // io.to(`user:${msg.to}`).emit('chatMessage', {
  //   from: user.id,
  //   source: user.id,
  //   message: msg.message,
  // });
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
