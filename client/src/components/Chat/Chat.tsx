import styles from './Chat.module.css';
import { RiChatSettingsFill, RiSendPlaneFill } from '@remixicon/react';
import { MessageItem } from '../MessageItem/MessageItem';
import { Conversation } from '../../services/conversation-service.ts';

const chat = {
  converstationId: '1',
  type: 'private',
  participants: [
    {
      userId: '1',
      firstName: 'Ivan',
      lastName: 'Ivanov',
    },
  ],
  lastMessage: {
    id: '1',
    date: new Date(Date.now()),
    sender: {
      userId: '1',
      firstName: 'Ivan',
      lastName: 'Ivanov',
    },
    text: 'Eho',
  },
  messages: [
    {
      id: '1',
      date: new Date(Date.now()),
      sender: {
        userId: '1',
        firstName: 'Ivan',
        lastName: 'Ivanov',
      },
      text: 'Eho',
    },
    {
      id: '2',
      date: new Date(Date.now()),
      sender: {
        userId: '12',
        firstName: 'Joro',
        lastName: 'Ivanov',
      },
      text: 'Zdr',
    },
    {
      id: '2',
      date: new Date(Date.now()),
      sender: {
        userId: '12',
        firstName: 'Joro',
        lastName: 'Ivanov',
      },
      text: 'Zdrasaassaasasasasasasasa',
    },
    {
      id: '1',
      date: new Date(Date.now()),
      sender: {
        userId: '1',
        firstName: 'Ivan',
        lastName: 'Ivanov',
      },
      text: 'lorem ipsum',
    },
    {
      id: '1',
      date: new Date(Date.now()),
      sender: {
        userId: '1',
        firstName: 'Ivan',
        lastName: 'Ivanov',
      },
      text: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
    },
    {
      id: '1',
      date: new Date(Date.now()),
      sender: {
        userId: '1',
        firstName: 'Ivan',
        lastName: 'Ivanov',
      },
      text: 'lorem ipsum',
    },
    {
      id: '1',
      date: new Date(Date.now()),
      sender: {
        userId: '1',
        firstName: 'Ivan',
        lastName: 'Ivanov',
      },
      text: 'lorem ipsum',
    },
    {
      id: '1',
      date: new Date(Date.now()),
      sender: {
        userId: '1',
        firstName: 'Ivan',
        lastName: 'Ivanov',
      },
      text: 'lorem ipsum',
    },
    {
      id: '1',
      date: new Date(Date.now()),
      sender: {
        userId: '1',
        firstName: 'Ivan',
        lastName: 'Ivanov',
      },
      text: 'lorem ipsum',
    },
    {
      id: '1',
      date: new Date(Date.now()),
      sender: {
        userId: '1',
        firstName: 'Ivan',
        lastName: 'Ivanov',
      },
      text: 'lorem ipsum',
    },
    {
      id: '1',
      date: new Date(Date.now()),
      sender: {
        userId: '1',
        firstName: 'Ivan',
        lastName: 'Ivanov',
      },
      text: 'lorem ipsum',
    },
    {
      id: '1',
      date: new Date(Date.now()),
      sender: {
        userId: '1',
        firstName: 'Ivan',
        lastName: 'Ivanov',
      },
      text: 'lorem ipsum',
    },
    {
      id: '1',
      date: new Date(Date.now()),
      sender: {
        userId: '1',
        firstName: 'Ivan',
        lastName: 'Ivanov',
      },
      text: 'lorem ipsum',
    },
  ],
};

interface ChatProps {
  conversation: Conversation;
  onOpenSettings: () => void;
}
  
export function Chat({ conversation, onOpenSettings }: ChatProps) {
  return (
    <section className={styles['section-chat']}>
      <div className={styles['chat']}>
        <ul className={styles['messages']}>
          {chat.messages.map((message) => (
            <MessageItem message={message} />
          ))}
        </ul>
      </div>
      <section className={styles['send-message-section']}>
        <form className={styles['messages-form']}>
          <button type="button" onClick={onOpenSettings}>
            <RiChatSettingsFill className={styles["ri-chat-settings-fill"]}></RiChatSettingsFill>
          </button>
          <input
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
