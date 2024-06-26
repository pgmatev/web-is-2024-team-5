import {
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiEditLine,
  RiForbid2Fill,
  RiVolumeMuteFill,
} from '@remixicon/react';
import styles from './ChatSettings.module.css';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Conversation,
  conversationService,
} from '../../services/conversation-service.ts';
import { useGroupInfo } from '../../hooks/useGroupInfo.ts';
import { useUser } from '../../contexts/UserContext.tsx';
import { useAsyncAction } from '../../hooks/useAsyncAction';

interface ChatSettingsProps {
  conversation: Conversation;
  onOpenSettings: () => void;
}

export function ChatSettings({ conversation }: ChatSettingsProps) {
  const [isChatMembersOpen, setIsChatMembersOpen] = useState(false);
  const onOpenChatMembers = useCallback(() => {
    setIsChatMembersOpen(!isChatMembersOpen);
  }, [isChatMembersOpen]);

  const { user } = useUser();
  const [isEditingName, setIsEditingName] = useState(false);

  const userIsAdmin = conversation.groupInfo?.adminId === user?.id;

  const groupInfo = useGroupInfo(conversation, user);

  const [newGroupName, setNewGroupName] = useState(groupInfo);

  const { trigger: onNameSubmit } = useAsyncAction(async () => {
    await conversationService.updateConversationName(conversation.id, {
      name: newGroupName,
    });

    if (conversation.groupInfo?.name) {
      conversation.groupInfo.name = newGroupName;
    }
  });

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

  const inputRef = useRef<HTMLInputElement>(null);

  const onEditButtonClick = useCallback(() => {
    setIsEditingName(!isEditingName);
  }, [isEditingName]);

  //---------------------------------------------
  const [isOpenChatFiles, setIsOpenChatFiles] = useState(false);
  const onOpenChatFiles = useCallback(() => {
    setIsOpenChatFiles(!isOpenChatFiles);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpenChatFiles]);

  const renderChatFiles = useMemo(() => {
    if (isOpenChatFiles) {
      return (
        <h3 className={styles['media-files-h3']}>
          There are no media and files
        </h3>
      );
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
      return (
        <ul className={styles['chat-security-ul']}>
          <li>
            <RiVolumeMuteFill></RiVolumeMuteFill>
            <h3>Mute chat</h3>
          </li>
          <li>
            <RiForbid2Fill></RiForbid2Fill>
            <h3>Leave chat</h3>
          </li>
        </ul>
      );
    }
    return;
  }, [isOpenChatSecutity]);
  //------------------------------------------------------

  return (
    <>
      <div className={styles['name-field']}>
        <input
          disabled={!isEditingName}
          ref={inputRef}
          value={isEditingName ? newGroupName : groupInfo}
          onChange={(event) => setNewGroupName(event.target.value)}
          className={styles['chat-name']}
        />
        {isEditingName && (
          <button className={styles['submit-btn']} onClick={onNameSubmit}>
            Save
          </button>
        )}
      </div>
      {userIsAdmin ? (
        <div className={styles['edit-chat-name']} onClick={onEditButtonClick}>
          <RiEditLine className={styles['ri-edit-line']}></RiEditLine>
          <h2>Change group name</h2>
        </div>
      ) : (
        <></>
      )}

      <button
        className={styles['chat-members']}
        onClick={() => onOpenChatMembers()}
      >
        <h3>Chat members</h3>
        {isChatMembersOpen ? (
          <RiArrowDownSLine></RiArrowDownSLine>
        ) : (
          <RiArrowRightSLine></RiArrowRightSLine>
        )}
      </button>
      {renderChatMembers}
      <button
        className={styles['chat-files']}
        onClick={() => onOpenChatFiles()}
      >
        <h3>Media and files</h3>
        {isOpenChatFiles ? (
          <RiArrowDownSLine></RiArrowDownSLine>
        ) : (
          <RiArrowRightSLine></RiArrowRightSLine>
        )}
      </button>
      {renderChatFiles}
      <button className={styles['chat-security']} onClick={onOpenChatSecutity}>
        <h3>Security</h3>
        {isOpenChatSecutity ? (
          <RiArrowDownSLine></RiArrowDownSLine>
        ) : (
          <RiArrowRightSLine></RiArrowRightSLine>
        )}
      </button>
      {renderChatSecurity}
    </>
  );
}
