export type IncomingChatMessage = {
  to: string;
  message: string;
  isGroup: boolean;
};

export type OutgoingChatMessage = {
  from: string;
  message: string;
  source: string; // group id or user id (meaning DM)
};

export interface ClientToServerEvents {
  chatMessage: (message: IncomingChatMessage) => void;
}

export interface ServerToClientEvents {
  chatMessage: (message: OutgoingChatMessage) => void;
}
