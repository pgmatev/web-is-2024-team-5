import express, { json } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { accessLoggingMiddleware } from './middlewares';
import { authRouter, conversationRouter, userRouter } from './routers';

export const app = express();

app.use(json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false })); // parse urlencoded form-data
app.use(cookieParser());
app.use(accessLoggingMiddleware);

app.get('/', (_req, res) => res.send('Hello world'));
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/conversations', conversationRouter);

export default app;
