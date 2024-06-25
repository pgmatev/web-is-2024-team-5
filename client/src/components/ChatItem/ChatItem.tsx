import { useMemo } from 'react';
import { Conversation } from '../../services/conversation-service';
import styles from './ChatItem.module.css';
import { useUser } from '../../contexts/UserContext';
import { generateDisplayUsername } from '../../lib/generateDisplayUsername';
import { RiLock2Fill } from '@remixicon/react';

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
  isChatItemSelected: boolean;
}

export function ChatItem({ chat, onClick, isChatItemSelected }: ChatItemProps) {
  const { user } = useUser();
  const date = useMemo(() => {
    if (chat.lastMessage) {
      return new Date(chat.lastMessage.createdAt);
    }
    return new Date(Date.now());
  }, [chat]);

  const groupInfo = useMemo(() => {
    if (chat.type === 'group') {
      return (
        chat.groupInfo?.name ??
        chat.participants
          .map((participant) => {
            const initial = participant.lastName[0];
            return `${participant.firstName} ${initial}.`;
          })
          .join(', ')
      );
    }

    const participantsExcludingCurrentUser = chat.participants.filter(
      (participant) => {
        return participant.id !== user?.id;
      },
    );

    if (participantsExcludingCurrentUser.length === 1) {
      return `${generateDisplayUsername(participantsExcludingCurrentUser[0])}`;
    }

    return 'Yourself';
  }, [chat.groupInfo?.name, chat.participants, chat.type, user?.id]);

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
