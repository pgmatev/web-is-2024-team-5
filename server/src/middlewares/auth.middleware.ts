import { NextFunction, Request, Response } from 'express';
import { config } from '../config';
import jwt from 'jsonwebtoken';
import { UserService } from '../services';

const userService = new UserService();

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const auth = req.headers.authorization;
  const { secret } = config.get('jwt');

  if (!auth?.startsWith('Bearer ')) {
    res.status(401).send({ message: 'Unauthorized' });
    return;
  }

  const token = auth.replace('Bearer ', ''); //take the remainder of the string only
  let tokenPayload;

  try {
    // Should be an interface that's also used when creating the token
    // Generally jwt logic should be in a separate service
    tokenPayload = jwt.verify(token, secret) as { userId: string };
  } catch (error) {
    res.status(401).send({ message: 'Unauthorized' });
    return;
  }
  const user = await userService.getUserById(tokenPayload.userId);

  if (!user) {
    res.status(401).send({ message: 'Unauthorized' });
    return;
  }

  req.user = user;

  next();
}
