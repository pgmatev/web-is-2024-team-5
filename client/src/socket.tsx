import { io, Socket } from 'socket.io-client';
import { tokenStorage } from './lib/token-storage.ts';
import { ClientToServerEvents, ServerToClientEvents } from '../../shared/types';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/chat`,
  {
    autoConnect: false,
    extraHeaders: {
      Authorization: `Bearer ${tokenStorage.token}`,
    },
  },
);
