import styles from './ChatList.module.css';
import { ChatItem } from '../chat-item/ChatItem';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import {
  Conversation,
  conversationService,
} from '../../services/conversation-service';

export function ChatList() {
  const [items, setItems] = useState<Conversation[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);

  const { trigger: fetchNextPage, loading } = useAsyncAction(
    async (page: number) => {
      const newConversations =
        await conversationService.getPaginatedConversations(page);
      newConversations.conversations.filter(
        (conversation) => !items.find((item) => item.id === conversation.id),
      );
      setItems((items) => [...items, ...newConversations.conversations]);
      setHasMore(newConversations.conversations.length > 0);
    },
  );

  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  useEffect(() => {
    fetchNextPage(page);
  }, [page]);

  return (
    <section className={styles['chats-section']}>
      <h1 className={styles['chats-title']}>Your chats list:</h1>
      <ul className={styles['chats']}>
        {items.map((item, index) => (
          <div
            ref={items.length === index + 1 ? lastItemRef : null}
            key={item.id}
          >
            <ChatItem chat={item} />
          </div>
        ))}
        {loading && <p>Loading...</p>}
      </ul>
      {/* <Link to={'/chat'}><p>here to chat</p></Link> */}
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
