import styles from './ChatList.module.css';
import { ChatItem } from '../ChatItem/ChatItem';
import { SearchComponent } from '../SearchComponent/SearchComponent';
import { Conversation } from '../../services/conversation-service';
import { useCallback } from 'react';
import { LoadingPage } from '../LoadingPage/LoadingPage';

interface ChatListProps {
  onCreateNewClick: () => void;
  fetchConversations: (search?: string) => void;
  conversations: Conversation[] | undefined;
  conversationsLoading: boolean;
  isNewChatPending: boolean;
  onChatClick: (conversation: Conversation) => void;
  selectedConversation: Conversation | undefined;
}

export function ChatList({
  onCreateNewClick,
  fetchConversations,
  conversations,
  conversationsLoading,
  isNewChatPending,
  onChatClick,
  selectedConversation,
}: ChatListProps) {
  //TODO: this should be the onSearch function

  const onSearch = useCallback(
    (search: string) => fetchConversations(search),
    [fetchConversations],
  );

  return (
    <section className={styles['chats-section']}>
      <div className={styles['chats-header']}>
        <h1 className={styles['chats-title']}>Chats</h1>
        <div className={styles['chats-search']}>
          <SearchComponent onSearch={onSearch} />
          <button
            className={styles['new-chat-button']}
            onClick={onCreateNewClick}
          >
            {isNewChatPending ? 'Exit' : 'Create new'}
          </button>
        </div>
      </div>
      {conversationsLoading ? (
        <LoadingPage />
      ) : (
        <ul className={styles['chats']}>
          {conversations
            ? conversations.map((item) => (
                <div key={item.id}>
                  <ChatItem
                    chat={item}
                    onClick={onChatClick}
                    isChatItemSelected={selectedConversation?.id === item.id}
                  />
                </div>
              ))
            : 'No conversations found.'}
        </ul>
      )}
    </section>
  );
}
