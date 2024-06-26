export type IncomingChatMessage = {
  conversationId: string;
  text?: string;
};

export type OutgoingChatMessage = {
  conversationId: string;
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
