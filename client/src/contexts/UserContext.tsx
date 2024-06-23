import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { UserInfo, tokenStorage } from '../lib/token-storage';

interface UserContextType {
  user: UserInfo | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserInfo | undefined>(tokenStorage.userInfo);

  useEffect(() => {
    tokenStorage.setHandler(setUser);

    return () => {
      tokenStorage.setHandler(undefined);
    };
  }, []);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
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
