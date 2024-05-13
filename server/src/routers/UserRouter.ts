import { Router } from "express";
import { CreateUserSchema, UserService } from "../services/UserService";
import { requestHandler } from "../middlewares/request-handler";

export const userRouter = Router();
const userService = new UserService();

userRouter.post(
  "/",
  requestHandler(async (req, res) => {
    const userInput = CreateUserSchema.parse(req.body);
    const user = await userService.createUser(userInput);

    res.status(201).send({ user });
  })
);
