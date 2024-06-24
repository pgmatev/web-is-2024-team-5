import styles from "./Chat.module.css";
import { RiSendPlaneFill} from '@remixicon/react';
import {MessageItem} from "../message-item/MessageItem"

const chat = {
    converstationId: '1',
    type: 'private',
    participants: [{
        userId: "1",
        firstName: "Ivan",
        lastName: "Ivanov"
    }],
    lastMessage: {
        id: "1",
        date: new Date(Date.now()),
        sender: {
            userId: "1",
            firstName: "Ivan",
            lastName: "Ivanov"
        },
        text: "Eho"
    },
    messages: [
        {
            id: "1",
            date: new Date(Date.now()),
            sender: {
                userId: "1",
                firstName: "Ivan",
                lastName: "Ivanov"
            },
            text: "Eho"
        },
        {
            id: "2",
            date: new Date(Date.now()),
            sender: {
                userId: "12",
                firstName: "Joro",
                lastName: "Ivanov"
            },
            text: "Zdr"
        },
        {
            id: "2",
            date: new Date(Date.now()),
            sender: {
                userId: "12",
                firstName: "Joro",
                lastName: "Ivanov"
            },
            text: "Zdrasaassaasasasasasasasa"
        },
        {
            id: "1",
            date: new Date(Date.now()),
            sender: {
                userId: "1",
                firstName: "Ivan",
                lastName: "Ivanov"
            },
            text: "lorem ipsum"
        },
        {
            id: "1",
            date: new Date(Date.now()),
            sender: {
                userId: "1",
                firstName: "Ivan",
                lastName: "Ivanov"
            },
            text: "lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum"
        },
        {
            id: "1",
            date: new Date(Date.now()),
            sender: {
                userId: "1",
                firstName: "Ivan",
                lastName: "Ivanov"
            },
            text: "lorem ipsum"
        },
        {
            id: "1",
            date: new Date(Date.now()),
            sender: {
                userId: "1",
                firstName: "Ivan",
                lastName: "Ivanov"
            },
            text: "lorem ipsum"
        },
        {
            id: "1",
            date: new Date(Date.now()),
            sender: {
                userId: "1",
                firstName: "Ivan",
                lastName: "Ivanov"
            },
            text: "lorem ipsum"
        },
        {
            id: "1",
            date: new Date(Date.now()),
            sender: {
                userId: "1",
                firstName: "Ivan",
                lastName: "Ivanov"
            },
            text: "lorem ipsum"
        },
        {
            id: "1",
            date: new Date(Date.now()),
            sender: {
                userId: "1",
                firstName: "Ivan",
                lastName: "Ivanov"
            },
            text: "lorem ipsum"
        },
        {
            id: "1",
            date: new Date(Date.now()),
            sender: {
                userId: "1",
                firstName: "Ivan",
                lastName: "Ivanov"
            },
            text: "lorem ipsum"
        },
        {
            id: "1",
            date: new Date(Date.now()),
            sender: {
                userId: "1",
                firstName: "Ivan",
                lastName: "Ivanov"
            },
            text: "lorem ipsum"
        },
        {
            id: "1",
            date: new Date(Date.now()),
            sender: {
                userId: "1",
                firstName: "Ivan",
                lastName: "Ivanov"
            },
            text: "lorem ipsum"
        }
    ]
}

export function Chat() {
    return (
        <section className={styles["section-chat"]}>
            <div className={styles["chat"]}>
                <ul className={styles["messages"]}>
                    {chat.messages.map((message) => <MessageItem message={message} />)}
                </ul>
            </div>
            <section className={styles["send-message-section"]}>
                <form className={styles["messages-form"]}>
                    <input className={styles["message-input"]} type="text" placeholder="Type message..."/>
                    <button className={styles["message-btn"]} type="submit">
                        <RiSendPlaneFill className={styles["ri-send-plane-fill"]} />
                    </button>
                </form>
            </section>
        </section>
    );
  }