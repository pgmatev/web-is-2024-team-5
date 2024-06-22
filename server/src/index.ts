import { config } from './config';
import express, { json, NextFunction, Request, Response } from 'express';
import { Server, Socket } from 'socket.io';
import * as http from 'http';
import { User } from './mock-models';
import {
  ClientToServerEvents,
  IncomingChatMessage,
  ServerToClientEvents,
} from './types';
import { authMiddleware } from './mock-auth';
import { accessLoggingMiddleware } from './middlewares';
import { db } from './mock-db';

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}

declare module 'http' {
  export interface IncomingMessage {
    user?: User;
  }
}

const app = express();
const server = http.createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server);
// TODO: Add Redis adapter to handle multiple instances

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

const handleGroupMessage = (user: User, msg: IncomingChatMessage) => {
  console.log(
    `User ${user.email} sent message to group ${msg.to}: "${msg.message}"`,
  );

  // Check if group exists
  // const group = db.groups.find((g) => g.id === msg.to);
  // if (!group) {
  //   return;
  // }
  //
  // Check if user is a member of the group
  // if (!group.users.includes(user.id)) {
  //   return;
  // }
  //
  // Save to database
  // db.messages.push({
  //   id: db.messages.length + 1,
  //   timestamp: Date.now(),
  //   sender: user.id,
  //   receiver: msg.to,
  //   text: msg.message,
  // });
  //
  // Fetch all active group members
  // const groupUsers = db.users.filter((u) => group.users.includes(u.id) && u.id !== user.id && u.status === 'online');
  //
  // Send message to all active group members
  // groupUsers.forEach((groupUser) => {
  //   io.to(`user:${groupUser.id}`).emit('chatMessage', {
  //     from: user.id,
  //     source: msg.to,
  //     message: msg.message,
  //   });
  // });
};

const handleDirectMessage = async (
  user: User,
  msg: IncomingChatMessage,
  socket: Socket,
) => {
  console.log(
    `User ${user.email} sent message to user ${msg.to}: "${msg.message}"`,
  );

  // Fetch the recipient
  const recipient = db.users.find((u) => u.id === msg.to);

  if (!recipient) {
    console.log(`User ${msg.to} not found.`);
    return;
  }

  // Save to database
  // db.messages.push({
  //   id: db.messages.length + 1,
  //   timestamp: Date.now(),
  //   sender: user.id,
  //   receiver: msg.to,
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
        source: user.id,
        message: msg.message,
      }),
    );

  if (msg.to === user.id) {
    return;
  }

  // Check if recipient is online
  if (recipient.status !== 'online') {
    console.log(`User ${msg.to} is offline.`);
    return;
  }

  // Send message to the recipient
  io.to(`user:${msg.to}`).emit('chatMessage', {
    from: user.id,
    source: user.id,
    message: msg.message,
  });
};

const onChatMessage = (user: User, socket: Socket) => {
  return async (msg: IncomingChatMessage) => {
    if (msg.isGroup) {
      handleGroupMessage(user, msg);
      return;
    }

    await handleDirectMessage(user, msg, socket);
  };
};

const onDisconnect = (user: User) => {
  return async () => {
    console.log(`User ${user.email} disconnected.`);

    const sockets = await io.in(`user:${user.id}`).fetchSockets();

    if (sockets.length === 0) {
      // no more active connections for the given user
      // update user status to offline
      user.status = 'offline';

      console.log(`User ${user.email} is now offline.`);
    }
  };
};

const onConnection = async (socket: Socket) => {
  const user = socket.request.user as User;
  socket.join(`user:${user.id}`);
  // update user status to online
  user.status = 'online';

  console.log(`User ${user.email} connected.`);

  socket.on('chatMessage', onChatMessage(user, socket));

  socket.on('disconnect', onDisconnect(user));

  socket.on('connect_error', (err) => {
    console.log(err);
  });
};

io.engine.use(onlyForHandshake(authMiddleware));
io.on('connection', onConnection);

app.use(json());

app.use(accessLoggingMiddleware);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/html/index.html');
});

server.listen(config.get('port'), '0.0.0.0', () => {
  console.log(`listening on *:${config.get('port')}`);
});
