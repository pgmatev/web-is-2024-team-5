import { Router } from 'express';
import { UserService } from '../services/user.service';
import {
  authMiddleware,
  requestHandlerMiddleware,
  selfMiddleware,
} from '../middlewares';

export const userRouter = Router();
const userService = new UserService();

userRouter.get(
  '/:id',
  authMiddleware,
  selfMiddleware,
  requestHandlerMiddleware(async (req, res) => {
    const id = req.params['id'];

    const user = await userService.getUserById(id);

    res.send(user);
  }),
);
