import { RiArrowRightLine, RiArrowRightSLine, RiEditLine } from "@remixicon/react";
import styles from "./ChatSettings.module.css";

interface ChatSettingsProps {
    onOpenSettings: () => void;
}

const ChatInfo = {
    name: "Group 1",
    members: ["Ivan Ivanov", "George Petrov", "Martin Iliev"]
}

export function ChatSettings({onOpenSettings}:ChatSettingsProps) {
    return ( 
    <>
        <h1 className={styles["chat-name"]}>{ChatInfo.name}</h1>
        <div className={styles["edit-chat-name"]}>
            <RiEditLine className={styles["ri-edit-line"]}></RiEditLine>
            <h2>Change group name</h2>
        </div>
        <div className={styles["chat-members"]}>
            <h3>Chat members</h3>
            <RiArrowRightSLine></RiArrowRightSLine>
        </div>
        <div className={styles["chat-files"]}>
            <h3>Media and files</h3>
            <RiArrowRightSLine></RiArrowRightSLine>
        </div>
        <div className={styles["chat-security"]}>
            <h3>Security</h3>
            <RiArrowRightSLine></RiArrowRightSLine>
        </div>
    </>
    );
}