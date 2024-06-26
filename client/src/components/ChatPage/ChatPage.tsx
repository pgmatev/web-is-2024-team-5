import styles from './ChatPage.module.css';
import { ChatList } from '../ChatList/ChatList';
import { Chat } from '../Chat/Chat';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NewChat } from '../NewChat/NewChat';
import { WelcomeChatWindow } from '../WelcomeChatWindow/WelcomeChatWindow.tsx';
import {
  Conversation,
  conversationService,
} from '../../services/conversation-service.ts';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { createSocket } from '../../socket.tsx';
import { OutgoingChatMessage } from '../../../../shared/types';
import { useUser } from '../../contexts/UserContext.tsx';
import { tokenStorage } from '../../lib/token-storage.ts';
import { Socket } from 'socket.io-client';

export function ChatPage() {
  const { user } = useUser();
  const socketRef = useRef<Socket>(createSocket(tokenStorage.token));

  const [isNewChatPending, setIsNewChatPending] = useState(false);
  const onCreateNewClick = useCallback(() => {
    setIsNewChatPending(!isNewChatPending);
    setSelectedConversation(undefined);
  }, [isNewChatPending]);

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation>();

  const [conversations, setConversations] = useState<Conversation[]>();

  const [messages, setMessages] = useState<OutgoingChatMessage[]>([]);

  const onMessage = (message: OutgoingChatMessage) => {
    if (message.conversation !== selectedConversation?.id) return;

    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const onConnect = () => {
    console.log('Connected to socket');
  };

  useEffect(() => {
    const socketLocal = socketRef.current;

    socketLocal.connect();
    socketLocal.on('connect', onConnect);
    socketLocal.on('message', onMessage);

    return () => {
      socketLocal.off('message', onMessage);
      socketLocal.off('connect', onConnect);
      socketLocal.disconnect();
    };
  }, []);

  const onSendMessage = useCallback(
    (message: string) => {
      if (!selectedConversation) return;
      if (!socketRef.current) return;

      socketRef.current.emit('message', {
        conversation: selectedConversation.id,
        text: message,
      });

      const newMessage: OutgoingChatMessage = {
        conversation: selectedConversation.id,
        text: message,
        sender: {
          id: user!.id,
          email: user!.email,
          firstName: user!.firstName,
          lastName: user!.lastName,
        },
        createdAt: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
    },
    [selectedConversation, user],
  );

  const {
    trigger: fetchConversations,
    loading: conversationsLoading,
    perform: performFetchConversations,
  } = useAsyncAction(async (search?: string) => {
    const conversationsResponse =
      await conversationService.getAllConversations(search);

    setConversations(conversationsResponse);
  });

  const { trigger: fetchMessages } = useAsyncAction(
    async (conversationId: string) => {
      const messagesResponse =
        await conversationService.getAllMessages(conversationId);
      setMessages(messagesResponse);
    },
  );

  const onChatClick = useCallback(
    (conversation: Conversation) => {
      if (conversation.id === selectedConversation?.id) return;

      setSelectedConversation(conversation);
      setIsNewChatPending(false);
      fetchMessages(conversation.id);
    },
    [fetchMessages, selectedConversation?.id],
  );

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
  }, [fetchConversations]);

  const render = useMemo(() => {
    if (isNewChatPending)
      return <NewChat onCreateSuccessful={onCreateSuccessful} />;
    if (selectedConversation)
      return (
        <Chat
          conversation={selectedConversation}
          sendMessage={onSendMessage}
          messages={messages}
        />
      );
    return <WelcomeChatWindow />;
  }, [
    isNewChatPending,
    messages,
    onCreateSuccessful,
    onSendMessage,
    selectedConversation,
  ]);

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
