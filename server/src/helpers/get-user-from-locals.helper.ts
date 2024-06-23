import { Response } from 'express';
import { IUser } from '../models/UserModel';

export function getUserFromLocals(res: Response): IUser {
  return res.locals.user;
}
