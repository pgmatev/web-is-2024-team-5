import { NextFunction, Request, Response } from 'express';

export const accessLoggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { method, originalUrl, httpVersion, socket } = req;
  const userAgent = req.get('user-agent') || '';

  res.on('finish', () => {
    const { statusCode } = res;

    const remoteAddr =
      socket.remoteAddress ||
      (req.headers['x-forwarded-for']
        ? (req.headers['x-forwarded-for'] as string).split(/\s*,\s*/)[0]
        : '');

    console.log(
      `[${new Date().toISOString()}] ${remoteAddr} - "${method} ${decodeURI(
        originalUrl,
      )} HTTP/${httpVersion}" ${statusCode} - ${userAgent}`,
    );
  });

  next();
};
