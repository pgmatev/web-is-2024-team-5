import { Router, Response, Request } from 'express';
import { requestHandlerMiddleware } from '../middlewares';
import { CreateUserSchema, UserService, createJwt } from '../services';
import { ZodError } from 'zod';
import * as bcrypt from 'bcrypt';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../errors';

const authRouter: Router = Router();
const userService = new UserService();

authRouter.post(
  '/register',
  requestHandlerMiddleware(async (req: Request, res: Response) => {
    if (await userService.findUserByEmail(req.body.email)) {
      throw new BadRequestError('User with that email is already registered.');
    }

    try {
      const userInput = CreateUserSchema.parse(req.body);
      userInput.password = await bcrypt.hash(userInput.password, 10);
      const user = await userService.createUser(userInput);
      const token = createJwt(user._id);
      res.status(201).send({
        message: 'User registered successfully.',
        accessToken: token,
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
  requestHandlerMiddleware(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await userService.findUserByEmail(email);

    if (!user) {
      throw new NotFoundError('User with this email does not exist.');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedError('Invalid password.');
    }

    const token = createJwt(user._id);

    return res.status(200).send({
      message: 'User logged in successfully.',
      accessToken: token,
    });
  }),
);

export { authRouter };
