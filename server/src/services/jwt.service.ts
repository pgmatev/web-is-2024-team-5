import jwt from 'jsonwebtoken';
import { config } from '../config';

const { secret, expiresIn } = config.get('jwt');

export function createJwt(userId: string): string {
  return jwt.sign(
    {
      userId: userId,
    },
    secret,
    {
      expiresIn,
    },
  );
}
