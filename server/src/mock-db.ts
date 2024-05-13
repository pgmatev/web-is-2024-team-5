import { User } from './mock-models';

export const db: { users: User[] } = {
  users: [
    {
      id: '1',
      status: 'offline',
      name: 'Alice',
      email: 'alice@test.com',
      contacts: ['2'],
    },
    {
      id: '2',
      status: 'offline',
      name: 'Bob',
      email: 'bob@test.com',
      contacts: ['1'],
    },
  ],
};
