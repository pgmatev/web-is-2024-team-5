import { RiArrowDownSLine, RiArrowRightSLine, RiEditLine, RiForbid2Fill, RiVolumeMuteFill } from "@remixicon/react";
import styles from "./ChatSettings.module.css";
import { useCallback, useMemo, useState } from "react";

const ChatInfo = {
    name: "Group 1",
    members: ["Ivan Ivanov", "George Petrov", "Martin Iliev"]
}


interface ChatSettingsProps {
    onOpenSettings: () => void;
    // onOpenChatMembers: () => void;
    // onOpenChatFiles: () => void;
    // onOpenChatSecutity: () => void;
}

export function ChatSettings({onOpenSettings}:ChatSettingsProps) {
    
    const [isChatMembersOpen, setIsChatMembersOpen] = useState(false);
    const onOpenChatMembers = useCallback(() => {
        setIsChatMembersOpen(!isChatMembersOpen);
    }, [isChatMembersOpen]);

    const renderChatMembers = useMemo(() => {
        if(isChatMembersOpen) {
        return <ul className={styles["chat-members-ul"]}>
            <li>
                <h3>Ivan Ivanov</h3>
            </li>
            <li>
                <h3>George Petrov</h3>
            </li>
        </ul>;
        }
        return ;
    }, [isChatMembersOpen]);

    //---------------------------------------------
    const [isOpenChatFiles, setIsOpenChatFiles] = useState(false);
    const onOpenChatFiles = useCallback(() => {
        setIsOpenChatFiles(!isOpenChatFiles);
    }, [isOpenChatFiles]);

    const renderChatFiles = useMemo(() => {
        if(isOpenChatFiles) {
        return <h3 className={styles["media-files-h3"]}>There are no media and files</h3> ;
        }
        return ;
    }, [isOpenChatFiles]);
    //--------------------------------------------
    
    const [isOpenChatSecutity, setIsOpenChatSecutity] = useState(false);
    const onOpenChatSecutity = useCallback(() => {
        setIsOpenChatSecutity(!isOpenChatSecutity);
    }, [isOpenChatSecutity]);

    const renderChatSecurity = useMemo(() => {
        if(isOpenChatSecutity) {
        return <ul className={styles["chat-security-ul"]}>
                    <li>
                        <RiVolumeMuteFill></RiVolumeMuteFill>
                        <h3>Mute chat</h3>
                    </li>
                    <li>
                        <RiForbid2Fill></RiForbid2Fill>
                        <h3>Leave chat</h3>
                    </li>
                </ul>;
        }
        return ;
    }, [isOpenChatSecutity]);
    //------------------------------------------------------

    return ( 
    <>
        <input disabled value={ChatInfo.name} className={styles["chat-name"]}></input>
        <div className={styles["edit-chat-name"]}>
            <RiEditLine className={styles["ri-edit-line"]}></RiEditLine>
            <h2>Change group name</h2>
        </div>
        <button className={styles["chat-members"]} onClick={ () => onOpenChatMembers()}>
            <h3>Chat members</h3>
            {isChatMembersOpen
            ?<RiArrowDownSLine></RiArrowDownSLine> 
            :<RiArrowRightSLine></RiArrowRightSLine>}
        </button>
        {renderChatMembers}
        <button className={styles["chat-files"]} onClick={ () => onOpenChatFiles()}>
            <h3>Media and files</h3>
            {isOpenChatFiles 
            ? <RiArrowDownSLine></RiArrowDownSLine> 
            : <RiArrowRightSLine></RiArrowRightSLine>}
        </button>
        {renderChatFiles}
        <button className={styles["chat-security"]} onClick={onOpenChatSecutity} >
            <h3>Security</h3>
            {isOpenChatSecutity
            ? <RiArrowDownSLine></RiArrowDownSLine> 
            : <RiArrowRightSLine></RiArrowRightSLine>}
        </button>
        {renderChatSecurity}
    </>
    );
}