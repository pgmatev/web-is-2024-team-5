import { Router } from "express";
import { UserService } from "../services/UserService";
import { requestHandler } from "../middlewares/request-handler";
import { ForbiddenError } from "../errors";
import { authMiddleware, getUserFromLocals } from "../middlewares/auth";

export const userRouter = Router();
const userService = new UserService();

userRouter.get(
  "/:id",
  authMiddleware,
  requestHandler(async (req, res) => {
    const id = req.params["id"];
    const loggedUser = getUserFromLocals(res);
    console.log(id, loggedUser.id);
    if (id !== loggedUser.id) {
      throw new ForbiddenError("Cannot access user");
    }

    const user = await userService.getUserById(id);
    console.log(user);
    res.send(user);
  })
);
