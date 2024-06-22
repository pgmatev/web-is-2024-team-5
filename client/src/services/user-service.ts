import { HttpService } from "./http-service";

export interface User {
  id: number;
  username: string;
  email: string;
}

class UserService {
  private http = new HttpService();

  async getUser(userId: string) {
    const result = await this.http.get<User>(`/users/${userId}`, {});
    return result;
  }
}

export const userService = new UserService();
