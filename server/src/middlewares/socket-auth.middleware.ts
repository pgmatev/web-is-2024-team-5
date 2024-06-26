import { config } from '../config';
import jwt from 'jsonwebtoken';
import { UserService } from '../services';
import { Socket } from 'socket.io';

const userService = new UserService();

export const socketAuthMiddleware = async (
  socket: Socket,
  next: (err?: Error) => void,
) => {
  const auth = socket.request.headers.authorization;

  if (!auth) {
    next(new Error('Unauthorized'));
    return;
  }

  const { secret } = config.get('jwt');

  if (!auth?.startsWith('Bearer ')) {
    next(new Error('Unauthorized'));
    return;
  }

  const token = auth.replace('Bearer ', '');
  let tokenPayload;

  try {
    tokenPayload = jwt.verify(token, secret) as { userId: string };
  } catch (error) {
    next(new Error('Unauthorized'));
    return;
  }
  const user = await userService.getUserById(tokenPayload.userId);

  if (!user) {
    next(new Error('Unauthorized'));
    return;
  }

  socket.request.user = user;

  next();
};
