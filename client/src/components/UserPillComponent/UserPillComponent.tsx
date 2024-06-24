import { useMemo } from 'react';
import { User } from '../../services/user-service';
import styles from './UserPillCompoent.module.css';

interface UserPillComponentProps {
  user: User;
  onRemove: (userId: string) => void;
}

export function UserPillComponent({ user, onRemove }: UserPillComponentProps) {
  const formattedUsername = useMemo(() => {
    return `${user.firstName} ${user.lastName[0]}.`;
  }, [user]);

  return (
    <div className={styles['pill']}>
      <span>{formattedUsername}</span>
      <button
        className={styles['pill-button']}
        onClick={() => onRemove(user.id)}
      >
        ×
      </button>
    </div>
  );
}
