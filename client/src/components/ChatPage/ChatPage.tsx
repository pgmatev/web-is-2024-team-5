import styles from './ChatPage.module.css';
import { ChatList } from '../ChatList/ChatList';
import { Chat } from '../Chat/Chat';
import { useCallback, useMemo, useState } from 'react';
import { NewChat } from '../NewChat/NewChat';
import { WelcomeChatWindow } from '../WelcomeChatWindow/WelcomeChatWindow.tsx';
import { Conversation } from '../../services/conversation-service.ts';

export function ChatPage() {
  const [isNewChatPending, setIsNewChatPending] = useState(false);
  const onCreateNewClick = useCallback(() => {
    setIsNewChatPending(!isNewChatPending);
    setSelectedConversation(undefined);
  }, [isNewChatPending]);

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation>();
  const onChatClick = useCallback((conversation: Conversation) => {
    setSelectedConversation(conversation);
    setIsNewChatPending(false);
  }, []);

  const onCreateSuccessful = useCallback((conversationId: string) => {
    setIsNewChatPending(false);
    //TODO: open the created chat!;
    console.log(conversationId);
  }, []);

  const render = useMemo(() => {
    if (isNewChatPending)
      return <NewChat onCreateSuccessful={onCreateSuccessful} />;
    if (selectedConversation)
      return <Chat conversation={selectedConversation} />;
    return <WelcomeChatWindow />;
  }, [isNewChatPending, onCreateSuccessful, selectedConversation]);

  return (
    <main className={styles['page-wrapper']}>
      <section className={styles['chatlist-section']}>
        <ChatList
          onCreateNewClick={onCreateNewClick}
          isNewChatPending={isNewChatPending}
          onChatClick={onChatClick}
        />
      </section>
      <section className={styles['chat-section']}>{render}</section>
    </main>
  );
}
