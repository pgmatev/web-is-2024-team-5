import { User } from '../services/user-service';

export function generateDisplayUsername(user: User) {
  const initial = user.lastName[0];
  return `${user.firstName} ${initial}.`;
}
