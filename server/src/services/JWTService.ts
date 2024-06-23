import jwt from 'jsonwebtoken';

export function createJwt(userId: string): string {
  return jwt.sign({ userId: userId }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRE as string,
  });
}
