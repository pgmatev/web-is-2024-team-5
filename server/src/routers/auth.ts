import { Router, Response, Request, request } from "express";
import { requestHandler } from "../middlewares/request-handler";
import { CreateUserSchema, UserService } from "../services/UserService";
import { ZodError } from "zod";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { redirectIfAuthenticatedUnsafe } from "../middlewares/jwt-cookie-auth";
import {BadRequestError, NotFoundError, UnauthorizedError} from "../errors";

const router: Router = Router();
const userService = new UserService();

router.get(
  "/register",
  redirectIfAuthenticatedUnsafe("/"),
  requestHandler(async (req: Request, res: Response) => {
    res.send(`
        <h2>Register</h2>
        <form action="/auth/register" method="POST">
            <input type="text" name="username" placeholder="Username" required>
            <input type="email" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Register</button>
        </form>
        `);
  })
);

router.get(
  "/login",
  redirectIfAuthenticatedUnsafe("/"),
  requestHandler(async (req: Request, res: Response) => {
    res.send(`
        <h2>Login</h2>
        <form action="/auth/login" method="POST">
            <input type="email" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
        `);
  })
);

router.post(
  "/register",
  redirectIfAuthenticatedUnsafe("/"),
  requestHandler(async (req: Request, res: Response) => {
    if (await userService.findUserByEmail(req.body.email)) {
        throw new BadRequestError("User with that email is already registered.");
    }

    try {
      const userInput = CreateUserSchema.parse(req.body);
      userInput.password = await bcrypt.hash(userInput.password, 10);
      const user = await userService.createUser(userInput);
      res.status(201).send({
        message: "User registered successfully.",
      });
    } catch (err) {
      if (err instanceof ZodError) {
        throw new BadRequestError("Please fill the fields in correctly.");
      } else {
        throw new BadRequestError("Bad request. Please try again.");
      }
    }
  })
);

router.post(
  "/login",
  redirectIfAuthenticatedUnsafe("/"),
  requestHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await userService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundError("User with this email does not exist.");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedError("Invalid password.");
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRE as string,
      }
    );

    res.status(200).send({
        message: "User logged in successfully.",
        accessToken: token,
    });
  })
);

// Client deletes local token only?
// router.get(
//   "/logout",
//   requestHandler(async (req: Request, res: Response) => {
//     if (req.cookies.accessToken) {
//       res.clearCookie("accessToken");
//       res.status(200).send({ message: "User successfully logged out." });
//     } else {
//       throw new UnauthorizedError("No user logged in.");
//     }
//   })
// );

export { router };
