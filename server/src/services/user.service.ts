import { z } from 'zod';
import { User } from '../models/UserModel';

export const CreateUserSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email format.' }),
  firstName: z.string(),
  lastName: z.string(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter.',
    })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Password must contain at least one symbol.',
    }),
});

type UserInput = z.infer<typeof CreateUserSchema>;

export class UserService {
  async createUser(user: UserInput) {
    return await User.create(user);
  }

  async findUserByEmail(email: string) {
    return await User.findOne({ email: email }).exec();
  }

  async getUserById(id: string) {
    const user = await User.findById(id).exec();
    if (user) {
      return user.toObject();
    }
    return undefined;
  }

  async getUsersBySearchParams(search: string) {
    const terms = search
      .split(' ')
      .map((term) => term.trim())
      .filter((term) => term.length > 0);

    if (terms.length === 0) {
      return [];
    }

    const regexTerms = terms.map((term) => new RegExp(term, 'i'));

    const searchConditions = [
      { firstName: { $in: regexTerms } },
      { lastName: { $in: regexTerms } },
      {
        $or: terms.map((term) => ({
          $or: [
            { firstName: new RegExp(term, 'i') },
            { lastName: new RegExp(term, 'i') },
          ],
        })),
      },
    ];

    const users = await User.find({
      $or: searchConditions,
    }).exec();

    if (users) {
      return users.map((user) => user.toObject());
    }

    return [];
  }
}
