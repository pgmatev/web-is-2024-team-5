import { Router, Response, Request, request } from 'express';
import { requestHandler } from '../middlewares/request-handler';
import { CreateUserSchema, UserService } from '../services/UserService';
import { ZodError } from 'zod';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../errors';

const authRouter: Router = Router();
const userService = new UserService();

authRouter.post(
  '/register',
  requestHandler(async (req: Request, res: Response) => {
    if (await userService.findUserByEmail(req.body.email)) {
      throw new BadRequestError('User with that email is already registered.');
    }

    try {
      const userInput = CreateUserSchema.parse(req.body);
      userInput.password = await bcrypt.hash(userInput.password, 10);
      const user = await userService.createUser(userInput);
      res.status(201).send({
        message: 'User registered successfully.',
      });
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).send({
          errors: err.flatten(),
        });
      } else {
        throw new BadRequestError('Bad request. Please try again.');
      }
    }
  }),
);

authRouter.post(
  '/login',
  requestHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await userService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundError('User with this email does not exist.');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedError('Invalid password.');
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRE as string,
      },
    );

    return res.status(200).send({
      message: 'User logged in successfully.',
      accessToken: token,
    });
  }),
);

export { authRouter };
