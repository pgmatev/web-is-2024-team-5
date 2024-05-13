export type Contact = {
  id: string;
  name: string;
  /* more general properties here */
};

export type User = Contact & {
  email: string;
  status: 'online' | 'offline';
  contacts: string[]; // contact ids
  /* more user properties here */
};

export type Group = Contact & {
  users: string[]; // user ids
  /* more group properties here */
};

type Attachment = {
  /* attachment properties here */
};

type BasicMessage = {
  id: number;
  timestamp: number;
  sender: string; // user id
  receiver: string; // contact id
  /* more general properties here */
};

type MessageWithText = BasicMessage & {
  text: string;
};

type MessageWithAttachment = BasicMessage & {
  attachment: string; // attachment id
};

export type Message =
  | MessageWithText
  | MessageWithAttachment
  | (MessageWithText & MessageWithAttachment);
