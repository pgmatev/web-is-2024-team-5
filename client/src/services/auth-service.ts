import { HttpService } from './http-service';
import { tokenStorage } from '../lib/token-storage';

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister extends UserLogin {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

class AuthService {
  private http = new HttpService();

  async login(params: UserLogin) {
    const body = await this.http.post<{ message: string; accessToken: string }>(
      '/auth/login',
      {
        body: params,
      },
    );
    tokenStorage.setToken(body.accessToken);
  }

  async register(params: UserRegister) {
    const body = await this.http.post<{ message: string; accessToken: string }>(
      '/auth/register',
      {
        body: params,
      },
    );
    tokenStorage.setToken(body.accessToken);
  }

  async logout() {
    tokenStorage.removeToken();
  }
}

export const authService = new AuthService();
