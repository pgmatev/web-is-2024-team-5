import {Router, Response, Request, request} from 'express';
import {requestHandler} from "../middlewares/request-handler";
import {CreateUserSchema, UserService} from "../services/UserService";
import {ZodError} from "zod";
import * as bcrypt from 'bcrypt';


const router: Router = Router();
const userService = new UserService();

router.get(
    '/register',
    requestHandler(async (req: Request, res: Response) => {
        res.send(`
        <h2>Register</h2>
        <form action="/auth/register" method="POST">
            <input type="text" name="username" placeholder="Username" required>
            <input type="email" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Register</button>
        </form>
        `)
    })
);

router.get(
    '/login',
    requestHandler(async (req: Request, res: Response) => {
        res.send("Login View");
    })
);

router.post(
    '/register',
    requestHandler(async (req: Request, res: Response) => {
        if (await userService.findUserByEmail(req.body.email)) {
            return res.status(400).send({message: "User with that email is already registered."})
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
                res.status(400).send({message: "Please fill the fields in correctly."});
            } else {
                res.status(400).send({message: "Bad request. Please try again."});
            }
        }
    })
);

router.post(
    '/login',
    requestHandler(async (req: Request, res: Response) => {

    })
);

export {router}