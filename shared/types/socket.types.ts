export type IncomingChatMessage = {
  conversationId: string;
  message: string;
};

export type OutgoingChatMessage = {
  from: string;
  message: string;
  conversationId: string;
};

export interface ClientToServerEvents {
  chatMessage: (message: IncomingChatMessage) => void;
}

export interface ServerToClientEvents {
  chatMessage: (message: OutgoingChatMessage) => void;
}
