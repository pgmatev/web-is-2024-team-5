import { RiArrowDownSLine, RiArrowRightSLine, RiEditLine, RiForbid2Fill, RiVolumeMuteFill } from '@remixicon/react';
import styles from './ChatSettings.module.css';
import { useCallback, useMemo, useState } from 'react';
import { Conversation, conversationService } from '../../services/conversation-service.ts';
import { useGroupInfo } from '../../hooks/useGroupInfo.ts';
import { useUser } from '../../contexts/UserContext.tsx';


interface ChatSettingsProps {
  conversation: Conversation | undefined,
  onOpenSettings: () => void;
  // onOpenChatMembers: () => void;
  // onOpenChatFiles: () => void;
  // onOpenChatSecutity: () => void;
}

export function ChatSettings({ conversation, onOpenSettings }: ChatSettingsProps) {
  const [isChatMembersOpen, setIsChatMembersOpen] = useState(false);
  const onOpenChatMembers = useCallback(() => {
    setIsChatMembersOpen(!isChatMembersOpen);
  }, [isChatMembersOpen]);

  const { user } = useUser();
  const [isEditingName, setIsEditingName] = useState(false);

  // TODO: need to fix this (technically it can't be undefined as settings button only renders on a selected conversation)
  if (!conversation) {
    console.error('Conversation is undefined in ChatSettings component.');
    throw new Error('Conversation is undefined in ChatSettings component.');
  }
  // TODO: need to fix this -> groupInfo.admin produces undefined
  const userIsAdmin = conversation.groupInfo?.adminId === user?.id;

  const groupInfo = useGroupInfo(conversation, user);

  // not sure if correct because using useMemo() with useGroupInfo method
  const [newGroupName, setNewGroupName] = useState(groupInfo);

  const handleNameChange = (event) => {
    setNewGroupName(event.target.value);
  };

  const handleNameSubmit = async () => {
    await conversationService.updateConversationName(conversation.id, newGroupName);
    setIsEditingName(false);
  };

  const renderChatMembers = useMemo(() => {
    if (isChatMembersOpen) {
      return (
        <ul className={styles['chat-members-ul']}>
          {conversation.participants.map((participant) => (
            <li>
              <h3>{`${participant.firstName} ${participant.lastName}`}</h3>
            </li>
          ))}
        </ul>
      );
    }
    return null;
  }, [isChatMembersOpen, conversation.participants]);

  //---------------------------------------------
  const [isOpenChatFiles, setIsOpenChatFiles] = useState(false);
  const onOpenChatFiles = useCallback(() => {
    setIsOpenChatFiles(!isOpenChatFiles);
  }, [isOpenChatFiles]);

  const renderChatFiles = useMemo(() => {
    if (isOpenChatFiles) {
      return <h3 className={styles['media-files-h3']}>There are no media and files</h3>;
    }
    return;
  }, [isOpenChatFiles]);
  //--------------------------------------------

  const [isOpenChatSecutity, setIsOpenChatSecutity] = useState(false);
  const onOpenChatSecutity = useCallback(() => {
    setIsOpenChatSecutity(!isOpenChatSecutity);
  }, [isOpenChatSecutity]);

  const renderChatSecurity = useMemo(() => {
    if (isOpenChatSecutity) {
      return <ul className={styles['chat-security-ul']}>
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
    return;
  }, [isOpenChatSecutity]);
  //------------------------------------------------------

  return (
    <>
      <input disabled value={groupInfo} className={styles['chat-name']}></input>
      {userIsAdmin ?
        <div className={styles['edit-chat-name']} onClick={() => setIsEditingName(!isEditingName)}>
          <RiEditLine className={styles['ri-edit-line']}></RiEditLine>
          <h2>Change group name</h2>
        </div>
        : <></>}

      {isEditingName ? (
        <div className={styles['edit-chat-name']}>
          <input className={styles['chat-name']}
                 type="text"
                 value={newGroupName}
                 onChange={handleNameChange}
                 placeholder="Enter new group name"
          />
          <button onClick={handleNameSubmit}>Save</button>
        </div>
      ) : <></>}

      <button className={styles['chat-members']} onClick={() => onOpenChatMembers()}>
        <h3>Chat members</h3>
        {isChatMembersOpen
          ? <RiArrowDownSLine></RiArrowDownSLine>
          : <RiArrowRightSLine></RiArrowRightSLine>}
      </button>
      {renderChatMembers}
      <button className={styles['chat-files']} onClick={() => onOpenChatFiles()}>
        <h3>Media and files</h3>
        {isOpenChatFiles
          ? <RiArrowDownSLine></RiArrowDownSLine>
          : <RiArrowRightSLine></RiArrowRightSLine>}
      </button>
      {renderChatFiles}
      <button className={styles['chat-security']} onClick={onOpenChatSecutity}>
        <h3>Security</h3>
        {isOpenChatSecutity
          ? <RiArrowDownSLine></RiArrowDownSLine>
          : <RiArrowRightSLine></RiArrowRightSLine>}
      </button>
      {renderChatSecurity}
    </>
  );
}