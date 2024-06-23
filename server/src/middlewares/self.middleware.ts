import { NextFunction, Request, Response } from 'express';
import { getUserFromRequestContext } from '../helpers';

export async function selfMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user = getUserFromRequestContext(req);

  if (req.params['id'] !== user.id) {
    res.status(403).send({ message: 'Forbidden' });
    return;
  }

  next();
}
