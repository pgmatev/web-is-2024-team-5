import { useMemo } from "react";
import styles from "./MessageItem.module.css"

interface MessageItemProps {
    message:
        {
            id: string,
            date: Date,
            sender: {
                userId: string,
                firstName: string,
                lastName: string
            },
            text: string
        }
}

export function MessageItem({message}: MessageItemProps) {
    const messageClass = useMemo(() => message.sender.userId == "1" ? "sent" : "received", [message]);
    return (
        <li className={styles[messageClass]}>
            <div>
                <span className={styles['sender-name']}>
                    {message.sender.firstName}
                </span>
                <span className={styles['message-time']}>
                {message.date.toDateString()}
            </span>
            </div>
            <span className={styles['message-text']}>
                    {message.text}
                </span>
        </li>
    );
}