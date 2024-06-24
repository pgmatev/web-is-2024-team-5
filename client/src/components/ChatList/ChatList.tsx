import styles from './ChatList.module.css';
import { ChatItem } from '../ChatItem/ChatItem';
import { SearchComponent } from '../SearchComponent/SearchComponent';

const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    participants: ['user1', 'user2'],
    messages: [
      {
        id: 'msg1',
        text: 'Hello, how are you?',
        sender: 'user1',
        createdAt: '2023-01-01T10:00:00Z',
      },
      {
        id: 'msg2',
        text: 'I am good, thanks!',
        sender: 'user2',
        createdAt: '2023-01-01T10:05:00Z',
      },
      {
        id: 'msg3',
        text: 'What about you?',
        sender: 'user2',
        createdAt: '2023-01-01T10:06:00Z',
      },
    ],
    lastMessage: {
      id: 'msg3',
      text: 'What about you?',
      sender: 'user2',
      createdAt: '2023-01-01T10:06:00Z',
    },
    type: 'private',
  },
  {
    id: 'conv2',
    participants: ['user3', 'user4', 'user5'],
    messages: [
      {
        id: 'msg4',
        text: 'Hi team, our next meeting is on Monday.',
        sender: 'user3',
        createdAt: '2023-01-02T09:00:00Z',
      },
      {
        id: 'msg5',
        text: 'Got it, thanks!',
        sender: 'user4',
        createdAt: '2023-01-02T09:10:00Z',
      },
      {
        id: 'msg6',
        text: 'See you all then.',
        sender: 'user5',
        createdAt: '2023-01-02T09:15:00Z',
      },
    ],
    lastMessage: {
      id: 'msg6',
      text: 'See you all then.',
      sender: 'user5',
      createdAt: '2023-01-02T09:15:00Z',
    },
    groupInfo: {
      groupName: 'Project Team',
      admin: 'user3',
    },
    type: 'group',
  },
  {
    id: 'grouup1',
    participants: ['user3', 'user4', 'user5'],
    messages: [
      {
        id: 'msg4',
        text: 'Hi team, our next meeting is on Monday.',
        sender: 'user3',
        createdAt: '2023-01-02T09:00:00Z',
      },
      {
        id: 'msg5',
        text: 'Got it, thanks!',
        sender: 'user4',
        createdAt: '2023-01-02T09:10:00Z',
      },
      {
        id: 'msg6',
        text: 'See you all then.',
        sender: 'user5',
        createdAt: '2023-01-02T09:15:00Z',
      },
    ],
    lastMessage: {
      id: 'msg6',
      text: 'See you all then.',
      sender: 'user5',
      createdAt: '2023-01-02T09:15:00Z',
    },
    groupInfo: {
      groupName: 'Project Team 1',
      admin: 'user3',
    },
    type: 'group',
  },
  {
    id: 'group2',
    participants: ['user3', 'user4', 'user5'],
    messages: [
      {
        id: 'msg4',
        text: 'Hi team, our next meeting is on Monday.',
        sender: 'user3',
        createdAt: '2023-01-02T09:00:00Z',
      },
      {
        id: 'msg5',
        text: 'Got it, thanks!',
        sender: 'user4',
        createdAt: '2023-01-02T09:10:00Z',
      },
      {
        id: 'msg6',
        text: 'See you all then.',
        sender: 'user5',
        createdAt: '2023-01-02T09:15:00Z',
      },
    ],
    lastMessage: {
      id: 'msg6',
      text: 'See you all then.',
      sender: 'user5',
      createdAt: '2023-01-02T09:15:00Z',
    },
    groupInfo: {
      groupName: 'Project Team 2',
      admin: 'user3',
    },
    type: 'group',
  },
  {
    id: 'conv3',
    participants: ['user6', 'user7'],
    messages: [
      {
        id: 'msg7',
        text: 'Are you coming to the party tonight?',
        sender: 'user6',
        createdAt: '2023-01-03T18:00:00Z',
      },
      {
        id: 'msg8',
        text: 'Yes, I will be there!',
        sender: 'user7',
        createdAt: '2023-01-03T18:10:00Z',
      },
    ],
    lastMessage: {
      id: 'msg8',
      text: 'Yes, I will be there!',
      sender: 'user7',
      createdAt: '2023-01-03T18:10:00Z',
    },
    type: 'private',
  },
];

interface ChatListProps {
  onCreateNewClick: () => void;
  isNewChatPending: boolean;
}

export function ChatList({
  onCreateNewClick,
  isNewChatPending,
}: ChatListProps) {
  //TODO: this should be the onSearch function
  function noop(_search: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <section className={styles['chats-section']}>
      <div className={styles['chats-header']}>
        <h1 className={styles['chats-title']}>Chats</h1>
        <div className={styles['chats-search']}>
          <SearchComponent onSearch={noop} />
          <button
            className={styles['new-chat-button']}
            onClick={onCreateNewClick}
          >
            {isNewChatPending ? 'Exit' : 'Create new'}
          </button>
        </div>
      </div>
      <ul className={styles['chats']}>
        {mockConversations.map((item) => (
          <div key={item.id}>
            <ChatItem chat={item} />
          </div>
        ))}
      </ul>
    </section>
  );

  // return (
  //   <main className={styles['chats-section']}>
  //     <h1 className={styles['chats-title']}>Your chats list:</h1>
  //     <ul className={styles['chats']}>
  //       {chats.length > 0
  //         ? chats.map((chat) => <ChatItem chat={chat} />)
  //         : `You don't have chats yet.`}
  //     </ul>
  //   </main>
  // );
}
