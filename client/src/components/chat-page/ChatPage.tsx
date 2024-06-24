import styles from './ChatPage.module.css';
import { ChatList } from '../chat-list/ChatList';
import { Chat } from '../chat/Chat';


export function ChatPage() {
    console.log("HI");
  return (
    <main className={styles['page-wrapper']}>
        <section className={styles['chatlist-section']}>
            <ChatList></ChatList>
        </section>
        <section className={styles["chat-section"]}>
            <Chat></Chat>
        </section>
    </main>
  );
}
