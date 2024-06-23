import { z, ZodError } from 'zod';
import { IUser, User } from '../models/UserModel';

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
}
