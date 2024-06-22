import { Request, Response, NextFunction } from "express";
import { config } from "../config";
import jwt from "jsonwebtoken";
import { UserService } from "../services/UserService";
import { IUser } from "../models/UserModel";

const userService = new UserService();

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const auth = req.headers.authorization;

  if (!auth?.startsWith("Bearer ")) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }

  const token = auth.replace("Bearer ", ""); //take the remainder of the string only
  let tokenPayload;

  try {
    const jwtSecret = process.env.JWT_SECRET as string;
    // Should be an interface that's also used when creating the token
    // Generally jwt logic should be in a separate service
    tokenPayload = jwt.verify(token, jwtSecret) as { userId: string };
  } catch (error) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }
  const user = await userService.getUserById(tokenPayload.userId);

  if (!user) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }
  res.locals.user = user;
  next();
}

export function getUserFromLocals(res: Response): IUser {
  return res.locals.user;
}
