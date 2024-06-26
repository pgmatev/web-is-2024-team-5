import { useUser } from '../../contexts/UserContext';
import styles from './Header.module.css';
import { authService } from '../../services/auth-service';
import { useAsyncAction } from '../../hooks/useAsyncAction';

export function Header() {
  const { user } = useUser();

  // const [user, setUser] = useState<User>();

  // useAsync(async () => {
  //   if (userInfo) {
  //     const responseUser = await userService.getUser(userInfo.userId);
  //     setUser(responseUser);
  //   }
  // }, [userInfo]);

  const { trigger: logout } = useAsyncAction(async () => {
    await authService.logout();
    // setUser(undefined);
  });

  return (
    <header className={styles['top-content']}>
      <h1 className={styles['header-title']} id="user-name">
        {user ? (
          <div>
            {`Welcome, ${user.firstName}`}
            <button onClick={logout} className={styles['logout-btn']}>Logout</button>
          </div>
        ) : (
          'Please login'
        )}
      </h1>
    </header>
  );
}
