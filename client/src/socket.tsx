import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '../../shared/types';

export const createSocket = (
  token: string,
): Socket<ServerToClientEvents, ClientToServerEvents> =>
  io(`${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/`, {
    autoConnect: false,
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
