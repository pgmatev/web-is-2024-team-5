import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export function requireJwt(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;
  try {
    const { userId } = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    req.body.userId = userId;
    next();
  } catch (err) {
    res.clearCookie("token");

    if (err instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .send({ message: "Session expired. Please log in again." });
    } else {
      return res
        .status(401)
        .send({ message: "Invalid or missing token. Please log in again." });
    }
  }
}

export function redirectIfAuthenticatedUnsafe(redirectUrl: string) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (req.cookies.token) {
      return res.redirect(redirectUrl);
    }
    next();
  };
}
