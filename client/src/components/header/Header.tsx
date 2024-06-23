import { RiSearch2Line } from '@remixicon/react';
import { useUser } from '../../contexts/UserContext';
import styles from './Header.module.css';
import { useAsync } from '../../hooks/useAsync';
import { User, userService } from '../../services/user-service';
import { useState } from 'react';
import { authService } from '../../services/auth-service';
import { useAsyncAction } from '../../hooks/useAsyncAction';

export function Header() {
  const { user: userInfo } = useUser();

  const [user, setUser] = useState<User>();

  useAsync(async () => {
    if (userInfo) {
      const responseUser = await userService.getUser(userInfo.userId);
      setUser(responseUser);
    }
  }, [userInfo]);

  const { trigger: logout } = useAsyncAction(async () => {
    await authService.logout();
    setUser(undefined);
  });

  return (
    <header className={styles['top-content']}>
      <h1 className={styles['header-title']} id="user-name">
        {user ? (
          <div>
            {`Welcome ${user.firstName}`}
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          'Please login'
        )}
      </h1>
      <div className={styles['search-bar']}>
        <input
          type="search"
          placeholder="Search..."
          className={styles['search-input']}
        />
        <RiSearch2Line className={styles['ri-search-2-line']} />
      </div>
    </header>
  );
}
