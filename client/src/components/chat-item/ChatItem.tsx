import styles from './ChatItem.module.css';

export interface Chat {
  chatId: string;
  chatName: string;
  lastMessage: {
    text: string;
    senderName: string;
    timestamp: Date;
  };
}

export interface ChatItemProps {
  chat: Chat;
}

export function ChatItem({ chat }: ChatItemProps) {
  return (
    <li data-channel-id={chat.chatId}>
      <div>
        <span className={styles['contact-name']}>{chat.chatName}</span>
        <span className={styles['contact-message']}>
          {chat.lastMessage ? chat.lastMessage.text : 'Start conversation'}
        </span>
      </div>
      <span className={styles['message-time']}>
        {chat.lastMessage.timestamp.toDateString()}
      </span>
    </li>
  );
}
