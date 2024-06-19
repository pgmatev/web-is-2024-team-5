import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import Cookies from "js-cookie";

interface User {
  userId: string;
  username: string;
}

interface UserContextType {
  user: User | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | undefined>();

  useEffect(() => {
    const fetchUserData = async (userId: string) => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/users/${userId}`);
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const getUserInfoFromToken = () => {
      const token = Cookies.get("token");
      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          const { userId } = decodedToken;
          fetchUserData(userId);
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    };

    getUserInfoFromToken();
  }, [token]);

  // Use a separate effect to listen for changes in the token
  useEffect(() => {
    const handleTokenChange = () => {
      const newToken = Cookies.get("token");
      if (newToken !== token) {
        setToken(newToken);
      }
    };

    // Set up listener for token changes
    const interval = setInterval(handleTokenChange, 1000); // Check every second

    // Clean up interval on unmount or when component re-renders
    return () => clearInterval(interval);
  }, [token]); // Dependency on token

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
