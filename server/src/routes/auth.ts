import {Router, Response, Request, request} from 'express';

const router: Router = Router();


router.get('/register', async (req: Request, res: Response) => {
    res.send("Register View");
});

router.get('/login', async (req: Request, res: Response) => {
    res.send("Login View");
});

router.post('/register', async (req: Request, res: Response) => {
    res.status(201).send("User Created Successfully");
});

router.post('/login', async (req: Request, res: Response) => {
    res.status(200).send("User Logged In Successfully");
});

export {router}