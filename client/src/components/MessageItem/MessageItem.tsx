import { useMemo } from 'react';
import styles from './MessageItem.module.css';
import { OutgoingChatMessage } from '../../../../shared/types';
import { useUser } from '../../contexts/UserContext.tsx';
import { formatDate } from '../../lib/date-helper';

interface MessageItemProps {
  message: OutgoingChatMessage;
}

export function MessageItem({ message }: MessageItemProps) {
  const { user } = useUser();

  const messageClass = useMemo(
    () => (message.sender.id == user!.id ? 'sent' : 'received'),
    [message.sender.id, user],
  );
  return (
    <li
      className={styles[messageClass]}
      id={new Date(message.createdAt).getTime().toString()}
    >
      <div>
        <span className={styles['sender-name']}>
          {message.sender.firstName}
        </span>
        <span className={styles['message-time']}>
          {formatDate(new Date(message.createdAt))}
        </span>
      </div>
      <span className={styles['message-text']}>{message.text}</span>
    </li>
  );
}
