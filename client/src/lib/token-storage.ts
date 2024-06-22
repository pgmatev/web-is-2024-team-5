import { jwtDecode } from "jwt-decode";
import { LocalStorage } from "./local-storage";

export interface UserInfo {
  userId: string;
}

export type AuthHandler = (user: UserInfo | undefined) => void;

class TokenStorage {
  private handler: AuthHandler | undefined = undefined;
  private storage = new LocalStorage("token");

  setHandler(handler: AuthHandler | undefined) {
    this.handler = handler;
  }

  get token() {
    return this.storage.get();
  }

  setToken(token: string) {
    this.storage.set(token);
    this.handler?.(this.userInfo);
  }

  removeToken() {
    this.storage.clear();
    this.handler?.(undefined);
  }

  get userInfo() {
    const token = this.token;
    return token ? this.userInfoFromToken(token) : undefined;
  }

  private userInfoFromToken(token: string): UserInfo {
    return jwtDecode(token);
  }
}

export const tokenStorage = new TokenStorage();
