import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { UserInfo, tokenStorage } from '../lib/token-storage';
import { User, userService } from '../services/user-service';
import { useAsyncAction } from '../hooks/useAsyncAction';

interface UserContextType {
  user: User | undefined;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>(
    tokenStorage.userInfo,
  );

  useEffect(() => {
    tokenStorage.setHandler(setUserInfo);
    trigger();

    return () => {
      tokenStorage.setHandler(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [user, setUser] = useState<User | undefined>(undefined);

  const { trigger, loading } = useAsyncAction(async () => {
    if (userInfo) {
      const responseUser = await userService.getUser(userInfo?.userId);
      setUser(responseUser);
      return;
    }

    setUser(undefined);
  });

  useEffect(() => {
    trigger();
  }, [trigger, userInfo]);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
}
