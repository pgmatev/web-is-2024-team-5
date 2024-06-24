import { useMemo } from 'react';
import { Conversation } from '../../services/conversation-service';
import styles from './ChatItem.module.css';

export interface Chatm {
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
  onClick: (conversation: Conversation) => void;
}

export function ChatItem({ chat, onClick }: ChatItemProps) {
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
    <li data-channel-id={chat.id} onClick={() => onClick(chat)}>
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
