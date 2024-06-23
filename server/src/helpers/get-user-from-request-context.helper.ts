import { Request } from 'express';
import { IUser } from '../models/UserModel';

export function getUserFromRequestContext(req: Request): IUser {
  if (!req.user) {
    throw new Error('User not found in request context');
  }

  return req.user;
}
