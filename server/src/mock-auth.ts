import { User } from './mock-models';
import { config } from './config';
import { db } from './mock-db';
import { NextFunction, Request, Response } from 'express';

const extractTokenFromAuthorizationHeader = (authorizationHeader?: string) => {
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return null;
  }

  return authorizationHeader.slice('Bearer '.length);
};

const verifyToken = (token: string): User | null => {
  const secret = config.get('secret');

  if (!token.startsWith(`${secret}-`)) {
    return null;
  }

  const tokenPayload = token.slice(secret.length + 1);

  const user = db.users.find((u) => u.email === tokenPayload);

  if (!user) {
    return null;
  }

  return user as User;
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = extractTokenFromAuthorizationHeader(req.headers.authorization);

  if (!token) {
    res.writeHead(401);
    res.end();
    return;
  }

  const user = verifyToken(token);

  if (!user) {
    res.writeHead(401);
    res.end();
    return;
  }

  req.user = user;

  next();
};
