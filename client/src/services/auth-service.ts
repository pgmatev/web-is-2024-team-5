import { HttpService } from "./http-service";
import { tokenStorage } from "../lib/token-storage";

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister extends UserLogin {
  email: string;
  username: string;
  name: string;
}

class AuthService {
  private http = new HttpService();

  async login(params: UserLogin) {
    const body = await this.http.post<{ message: string; accessToken: string }>(
      "/auth/login",
      {
        body: params,
      }
    );
    await tokenStorage.setToken(body.accessToken);
  }

  async register(params: UserRegister) {
    await this.http.post<{ message: string }>("/auth/register", {
      body: params,
    });
    // tokenStorage.setToken(body.token);
  }

  async logout() {
    await tokenStorage.removeToken();
  }
}

export const authService = new AuthService();
