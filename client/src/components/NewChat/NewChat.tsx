import { useCallback, useState } from 'react';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { User, userService } from '../../services/user-service';
import { SearchComponent } from '../SearchComponent/SearchComponent';
import styles from './NewChat.module.css';
import { UserPillComponent } from '../UserPillComponent/UserPillComponent';
import { conversationService } from '../../services/conversation-service';
import { LoadingPage } from '../LoadingPage/LoadingPage';
import { useUser } from '../../contexts/UserContext';

interface NewChatProps {
  onCreateSuccessful: (conversationId: string) => void;
}

export function NewChat({ onCreateSuccessful }: NewChatProps) {
  const { user: currentUser } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [showDropdown, setShowDropDown] = useState(false);

  const { trigger: searchUsers } = useAsyncAction(async (search: string) => {
    if (search) {
      const responseUsers = await userService.getUsersBySearchParam(search);
      setShowDropDown(true);
      return setUsers(
        responseUsers.filter((user) => user.id !== currentUser?.id),
      );
    }
    setShowDropDown(false);
    return setUsers([]);
  });

  const handleResultClick = (user: User) => {
    if (!selectedUsers.includes(user)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const onUserRemove = useCallback(
    (userId: string) => {
      setSelectedUsers(selectedUsers.filter((user) => user.id != userId));
    },
    [selectedUsers],
  );

  const {
    trigger: submitCreation,
    loading: submitLoading,
    error,
  } = useAsyncAction(async () => {
    if (currentUser) {
      const participants = [currentUser, ...selectedUsers].map(
        (user) => user.id,
      );
      const conversation =
        await conversationService.createConversation(participants);
      onCreateSuccessful(conversation.id);
    }
  });

  return (
    <section className={styles['section-chat']}>
      <div className={styles['new-chat-header']}>
        <h1>Chat with: </h1>
        <SearchComponent onSearch={searchUsers} />
        {showDropdown && (
          <ul className={styles['dropdown-ul']}>
            {users.length > 0 ? (
              users.map((user) => (
                <li
                  key={user.id}
                  onClick={() => handleResultClick(user)}
                  className={styles['dropdown-li']}
                >
                  {`${user.firstName} ${user.lastName}`}
                </li>
              ))
            ) : (
              <li key={0} className={styles['dropdown-li']}>
                No users found
              </li>
            )}
          </ul>
        )}
      </div>
      <div className={styles['new-chat-footer']}>
        <h1>Selected users:</h1>
        {selectedUsers.map((user) => (
          <UserPillComponent user={user} onRemove={onUserRemove} />
        ))}
        <button onClick={submitCreation} className={styles['create-button']}>
          {submitLoading ? <LoadingPage></LoadingPage> : 'Create'}
        </button>
        {!!error && <span>There was a problem creating this conversation</span>}
      </div>
    </section>
  );
}
