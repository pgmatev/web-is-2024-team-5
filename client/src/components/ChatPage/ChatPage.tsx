import styles from './ChatPage.module.css';
import { ChatList } from '../ChatList/ChatList';
import { Chat } from '../Chat/Chat';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { NewChat } from '../NewChat/NewChat';
import { WelcomeChatWindow } from '../WelcomeChatWindow/WelcomeChatWindow.tsx';
import {
  Conversation,
  conversationService,
} from '../../services/conversation-service.ts';
import { useAsyncAction } from '../../hooks/useAsyncAction';

export function ChatPage() {
  const [isNewChatPending, setIsNewChatPending] = useState(false);
  const onCreateNewClick = useCallback(() => {
    setIsNewChatPending(!isNewChatPending);
    setSelectedConversation(undefined);
  }, [isNewChatPending]);

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation>();

  const [conversations, setConversations] = useState<Conversation[]>();

  const {
    trigger: fetchConversations,
    loading: conversationsLoading,
    perform: performFetchConversations,
  } = useAsyncAction(async (search?: string) => {
    const conversationsResponse =
      await conversationService.getAllConversations(search);

    setConversations(conversationsResponse);
  });

  const onChatClick = useCallback((conversation: Conversation) => {
    setSelectedConversation(conversation);
    setIsNewChatPending(false);
  }, []);

  const { trigger: onCreateSuccessful } = useAsyncAction(
    async (conversationId: string) => {
      setIsNewChatPending(false);
      await performFetchConversations();

      // not working, idc
      setSelectedConversation(
        conversations?.find(
          (conversation) => conversation.id === conversationId,
        ),
      );
    },
  );

  useEffect(() => {
    fetchConversations();
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
          fetchConversations={fetchConversations}
          conversations={conversations}
          conversationsLoading={conversationsLoading}
          onCreateNewClick={onCreateNewClick}
          isNewChatPending={isNewChatPending}
          onChatClick={onChatClick}
          selectedConversation={selectedConversation}
        />
      </section>
      <section className={styles['chat-section']}>{render}</section>
    </main>
  );
}
