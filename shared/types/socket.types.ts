export type IncomingChatMessage = {
  conversation: string;
  text?: string;
};

export type OutgoingChatMessage = {
  id: string;
  conversation: string;
  sender: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  text?: string;
  createdAt: Date;
};

export interface ClientToServerEvents {
  message: (message: IncomingChatMessage) => void;
}

export interface ServerToClientEvents {
  message: (message: OutgoingChatMessage) => void;
}
