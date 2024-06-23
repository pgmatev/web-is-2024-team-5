import { Server } from 'socket.io';
import { NextFunction, Request, Response } from 'express';
import { authMiddleware } from '../middlewares';

export const chatSocket = (io: Server) => {
  io.engine.use(onlyForHandshake(authMiddleware));

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
