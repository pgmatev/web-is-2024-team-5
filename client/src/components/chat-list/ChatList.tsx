import styles from './ChatList.module.css';
import { Chatm, ChatItem } from '../chat-item/ChatItem';
// import { Link } from 'react-router-dom';

const chats: Chatm[] = [
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
      text: 'Hello, how are you?Hello, how are you?',
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
  {
    chatId: '2',
    chatName: 'Ivan',
    lastMessage: {
      text: 'Hello, how are you?',
      senderName: 'Ivan',
      timestamp: new Date(Date.now()),
    },
  }
];

export function ChatList() {
  console.log('HERE BEBY');
  return (
    <section className={styles['chats-section']}>
      <h1 className={styles['chats-title']}>Your chats list:</h1>
      <ul className={styles['chats']}>
        {chats.length > 0
          ? chats.map((chat) => <ChatItem chat={chat} />)
          : `You don't have chats yet.`}
      </ul>
      {/* <Link to={'/chat'}><p>here to chat</p></Link> */}
    </section>
  );
}
