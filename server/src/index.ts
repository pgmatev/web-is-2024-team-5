import { config } from './config';
import * as http from 'http';
import mongoose from 'mongoose';
import app from './app';
import { IUser } from './models/UserModel';
import { Server } from 'socket.io';
import { chatSocket } from './sockets';
import { ClientToServerEvents, ServerToClientEvents } from '../../shared/types';

declare global {
  namespace Express {
    export interface Request {
      user?: IUser;
    }
  }
}

declare module 'http' {
  export interface IncomingMessage {
    user?: IUser;
  }
}

const server = http.createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: '*',
    credentials: true,
  },
});

chatSocket(io);

mongoose
  .connect(config.get('mongoUri'), {})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

const port = config.get('port');
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
