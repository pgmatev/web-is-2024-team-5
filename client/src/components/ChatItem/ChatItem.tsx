import { useMemo } from 'react';
import { Conversation } from '../../services/conversation-service';
import styles from './ChatItem.module.css';
import { useUser } from '../../contexts/UserContext';
import { RiLock2Fill } from '@remixicon/react';
import { getConversationName } from '../../lib/conversation-helper.ts';
import { formatDate } from '../../lib/date-helper';

export interface ChatItemProps {
  chat: Conversation;
  onClick: (conversation: Conversation) => void;
  isChatItemSelected: boolean;
}

export function ChatItem({ chat, onClick, isChatItemSelected }: ChatItemProps) {
  const { user } = useUser();
  const date = useMemo(() => {
    if (chat.lastMessage) {
      return new Date(chat.lastMessage.createdAt);
    }
    return undefined;
  }, [chat]);

  const groupInfo = useMemo(() => {
    return getConversationName(chat, user!);
  }, [chat, user]);

  return (
    <li
      className={
        styles[isChatItemSelected ? 'selected-chat-item' : 'chat-item']
      }
      data-channel-id={chat.id}
      onClick={() => onClick(chat)}
    >
      <div className={styles['chat-metadata']}>
        <span
          className={
            styles[
              isChatItemSelected ? 'selected-contact-name' : 'contact-name'
            ]
          }
        >
          {groupInfo}
          {chat.type === 'private' && <RiLock2Fill />}
        </span>
        <span className={styles['contact-message']}>
          {chat.lastMessage?.text
            ? chat.lastMessage.text.length > 60
              ? chat.lastMessage.text.substring(0, 60) + '...'
              : chat.lastMessage.text
            : 'Start conversation'}
        </span>
      </div>
      {date && (
        <span className={styles['message-time']}>{formatDate(date)}</span>
      )}
    </li>
  );
}
