export interface IChatItem {
  channelID: string;
  username: string;
  lastMessage: {
    text: string;
    sender: string;
    timestamp: Date;
  };
}
