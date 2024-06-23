import { NextFunction, Request, Response } from 'express';
import { getUserFromLocals } from '../helpers';

export async function selfMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user = getUserFromLocals(res);

  if (req.params['id'] !== user.id) {
    res.status(403).send({ message: 'Forbidden' });
    return;
  }

  next();
}
