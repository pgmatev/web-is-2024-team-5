import { HttpService } from './http-service';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isOnline: boolean;
  isActive: boolean;
}

class UserService {
  private http = new HttpService();

  async getUser(userId: string) {
    const result = await this.http.get<User>(`/users/${userId}`, {});
    return result;
  }

  async getUsersBySearchParam(search: string) {
    const result = await this.http.get<User[]>(`/users`, {
      query: {
        search,
      },
    });

    return result;
  }
}

export const userService = new UserService();
