import styles from './Chat.module.css';
import { RiSendPlaneFill } from '@remixicon/react';
import { MessageItem } from '../MessageItem/MessageItem';
import { Conversation } from '../../services/conversation-service.ts';
import { useUser } from '../../contexts/UserContext.tsx';
import { getConversationName } from '../../lib/conversation-helper.ts';
import { FormEvent, useCallback, useMemo, useState } from 'react';
import { OutgoingChatMessage } from '../../../../shared/types';

interface ChatProps {
  conversation: Conversation;
  sendMessage: (message: string) => void;
  messages: OutgoingChatMessage[];
}

export function Chat({ conversation, sendMessage, messages }: ChatProps) {
  const { user } = useUser();
  const [newMessage, setNewMessage] = useState('');

  const groupInfo = useMemo(() => {
    return getConversationName(conversation, user!);
  }, [conversation, user]);

  const onSendMessage = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (newMessage.trim()) {
        sendMessage(newMessage);
        setNewMessage('');
      }
    },
    [newMessage, sendMessage],
  );

  return (
    <section className={styles['section-chat']}>
      <header className={styles['chat-header']}>
        <h1 className={styles['chat-title']}>{groupInfo}</h1>
      </header>
      <div className={styles['chat']}>
        <ul className={styles['messages']}>
          {messages.map((message) => (
            <MessageItem
              key={new Date(message.createdAt).getTime()}
              message={message}
            />
          ))}
        </ul>
      </div>
      <section className={styles['send-message-section']}>
        <form
          onSubmit={(event) => onSendMessage(event)}
          className={styles['messages-form']}
        >
          <input
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
            className={styles['message-input']}
            type="text"
            placeholder="Type message..."
          />
          <button className={styles['message-btn']} type="submit">
            <RiSendPlaneFill className={styles['ri-send-plane-fill']} />
          </button>
        </form>
      </section>
    </section>
  );
}
