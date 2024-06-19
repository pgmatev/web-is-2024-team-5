import { Router } from "express";
import { UserService } from "../services/UserService";
import { requestHandler } from "../middlewares/request-handler";
import { requireJwt } from "../middlewares/jwt-cookie-auth";
import { ForbiddenError } from "../errors";
import { transformUser } from "../transformers/users-transformer";

export const userRouter = Router();
const userService = new UserService();

userRouter.get(
  "/:id",
  requireJwt,
  requestHandler(async (req, res) => {
    const id = req.params["id"];
    if (id !== req.body.userId) {
      throw new ForbiddenError("Cannot access user");
    }

    const user = await userService.getUserById(id);
    console.log(user);
    const transformedUser = transformUser(user);
    res.send(transformedUser);
  })
);
