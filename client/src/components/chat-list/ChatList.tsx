import styles from './ChatList.module.css';
import { Chat, ChatItem } from '../chat-item/ChatItem';

const chats: Chat[] = [
  {
    chatId: '1',
    chatName: 'Grupa',
    lastMessage: {
      text: 'Hello',
      senderName: 'Ivan',
      timestamp: new Date(Date.now()),
    },
  },
  {
    chatId: '2',
    chatName: 'Ivan',
    lastMessage: {
      text: 'Hello, how are you?',
      senderName: 'Ivan',
      timestamp: new Date(Date.now()),
    },
  },
  {
    chatId: '2',
    chatName: 'Ivan',
    lastMessage: {
      text: 'Hello, how are you?',
      senderName: 'Ivan',
      timestamp: new Date(Date.now()),
    },
  },
  {
    chatId: '2',
    chatName: 'Ivan',
    lastMessage: {
      text: 'Hello, how are you?',
      senderName: 'Ivan',
      timestamp: new Date(Date.now()),
    },
  },
  {
    chatId: '2',
    chatName: 'Ivan',
    lastMessage: {
      text: 'Hello, how are you?',
      senderName: 'Ivan',
      timestamp: new Date(Date.now()),
    },
  },
  {
    chatId: '2',
    chatName: 'Ivan',
    lastMessage: {
      text: 'Hello, how are you?',
      senderName: 'Ivan',
      timestamp: new Date(Date.now()),
    },
  },
];

export function ChatList() {
  console.log('HERE BEBY');
  return (
    <main className={styles['chats-section']}>
      <h1 className={styles['chats-title']}>Your chats list:</h1>
      <ul className={styles['chats']}>
        {chats.length > 0
          ? chats.map((chat) => <ChatItem chat={chat} />)
          : `You don't have chats yet.`}
      </ul>
    </main>
  );
}
