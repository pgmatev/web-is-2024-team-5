import { Server } from 'socket.io';
import { NextFunction } from 'express';

export const chatSocket = (io: Server) => {
  io.engine.use(
    onlyForHandshake((req, res, next) => {
      console.log('Handshake:', req);
      next();
    }),
  );

  io.of('/chat').on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
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
