import { config } from './config';
import express, { json } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { authRouter } from './routers/auth';
import { userRouter } from './routers/UserRouter';
import cors from 'cors';
import { accessLoggingMiddleware } from './middlewares';
import { authMiddleware } from './middlewares/auth';

const mongoURI = process.env.MONGODB_URI as string;

mongoose
  .connect(mongoURI, {})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

//Server
const app = express();
const port = config.get('port');

app.use(json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false })); // parse urlencoded form-data
app.use(cookieParser());
app.use(accessLoggingMiddleware);

app.get('/', (_req, res) => res.send('Hello world'));
app.use('/auth', authRouter);
app.use('/users', userRouter);

// temp route to test authentication
app.get('/secret', authMiddleware, (req, res) => {
  console.log(req.body.user);
  res.send('If you can view this page this means that you are authenticated.');
});

app.listen(port);
console.log('Server started on port ', port);
