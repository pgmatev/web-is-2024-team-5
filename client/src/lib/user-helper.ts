import { User } from '../services/user-service.ts';

export const getUserName = (user: User) => {
  return `${user.firstName} ${user.lastName}`;
};
