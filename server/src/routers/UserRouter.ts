import { Router } from "express";
import { CreateUserSchema, UserService } from "../services/UserService";
import { requestHandler } from "../middlewares/request-handler";

export const userRouter = Router();
const userService = new UserService();

