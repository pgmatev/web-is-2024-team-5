import { RiSearch2Line } from '@remixicon/react';
import { useUser } from '../../contexts/UserContext';
import styles from './Header.module.css';

export function Header() {
  const { user } = useUser();

  return (
    <header className={styles['top-content']}>
      <h1 className={styles['header-title']} id="user-name">
        {user ? `Welcome ${user.username}` : 'Please login'}
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
