import { Router, Response, Request, request } from "express";
import { requestHandler } from "../middlewares/request-handler";
import { CreateUserSchema, UserService } from "../services/UserService";
import { ZodError } from "zod";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { redirectIfAuthenticatedUnsafe } from "../middlewares/jwt-cookie-auth";

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
            <input type="text" name="firstName" placeholder="First Name" required>
            <input type="text" name="lastName" placeholder="Last Name" required>
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
      return res
        .status(400)
        .send({ message: "User with that email is already registered." });
    }

    try {
      const userInput = CreateUserSchema.parse(req.body);
      userInput.password = await bcrypt.hash(userInput.password, 10);
      const user = await userService.createUser(userInput);
      res.status(201).send({
        message: "User registered successfully.",
        user, // TODO: to remove, preview only
      });
    } catch (err) {
      if (err instanceof ZodError) {
        res
          .status(400)
          .send({ message: "Please fill the fields in correctly." });
      } else {
        res.status(400).send({ message: "Bad request. Please try again." });
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
      return res
        .status(404)
        .send({ message: "User with this email does not exist." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send({ message: "Invalid password." });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRE as string,
      }
    );
    res.cookie("token", token, { httpOnly: false });

    return res.status(200).send({ message: "User logged in successfully." });
  })
);

router.get(
  "/logout",
  requestHandler(async (req: Request, res: Response) => {
    if (req.cookies.token) {
      res.clearCookie("token");
      return res.status(200).send({ message: "User successfully logged out." });
    } else {
      return res.status(401).send({ message: "No user logged in." });
    }
  })
);

export { router };
