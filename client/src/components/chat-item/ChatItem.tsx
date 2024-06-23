import { useMemo } from 'react';
import { Conversation } from '../../services/conversation-service';
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
  chat: Conversation;
}

export function ChatItem({ chat }: ChatItemProps) {
  //TODO: fetch users' names when there is no groupname
  // const userList = useMemo(() =>{
  //   return
  // }, [chat]);
  const date = useMemo(() => {
    if (chat.lastMessage) {
      return new Date(chat.lastMessage.createdAt);
    }
    return undefined;
  }, [chat]);

  return (
    <li data-channel-id={chat.id}>
      <div>
        <span className={styles['contact-name']}>
          {chat.groupInfo?.groupName ?? chat.id}
        </span>
        <span className={styles['contact-message']}>
          {chat.lastMessage ? chat.lastMessage.text : 'Start conversation'}
        </span>
      </div>
      {date && (
        <span className={styles['message-time']}>
          {date.toLocaleDateString()}
        </span>
      )}
    </li>
  );
}
