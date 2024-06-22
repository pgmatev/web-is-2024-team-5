export interface User {
  username: string;
  password?: string;
}

type AuthHandler = (user: User | null) => void;

class AuthService {
  private handler: AuthHandler | null = null;

  setHandler(handler: AuthHandler | null) {
    this.handler = handler;
  }

  login(user: User) {
    this.handler?.(user);
    window.localStorage.setItem('username', user.username);
  }

  logout() {
    this.handler?.(null);
    window.localStorage.removeItem('username');
  }

  getSavedUser() {
    const savedUsername = window.localStorage.getItem('username');
    return savedUsername ? { username: savedUsername } : null;
  }
}

export const authService = new AuthService();
