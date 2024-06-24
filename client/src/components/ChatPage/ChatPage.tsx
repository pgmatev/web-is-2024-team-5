import styles from './ChatPage.module.css';
import { ChatList } from '../ChatList/ChatList';
import { Chat } from '../Chat/Chat';
import { useCallback, useState } from 'react';
import { NewChat } from '../NewChat/NewChat';

export function ChatPage() {
  const [isNewChatPending, setIsNewChatPending] = useState(false);
  const onCreateNewClick = useCallback(() => {
    setIsNewChatPending(!isNewChatPending);
  }, [isNewChatPending]);

  const onCreateSuccessful = useCallback((conversationId: string) => {
    setIsNewChatPending(false);
    //TODO: open the created chat!;
    console.log(conversationId);
  }, []);

  return (
    <main className={styles['page-wrapper']}>
      <section className={styles['chatlist-section']}>
        <ChatList
          onCreateNewClick={onCreateNewClick}
          isNewChatPending={isNewChatPending}
        />
      </section>
      <section className={styles['chat-section']}>
        {isNewChatPending ? (
          <NewChat onCreateSuccessful={onCreateSuccessful} />
        ) : (
          <Chat />
        )}
      </section>
    </main>
  );
}
