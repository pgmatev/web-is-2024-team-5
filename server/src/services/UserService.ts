import { z } from "zod";
import { IUser, User } from "../models/UserModel";

export const CreateUserSchema = z.object({
  email: z.string().email(),
  username: z.string(),
  password: z.string(),
});

type UserInput = z.infer<typeof CreateUserSchema>;

export class UserService {
  async createUser(user: UserInput) {
    return await User.create(user);
  }

  async findUserByEmail(email: string) {
    const user = await User.findOne({ email: email }).exec();
    if (user) {
      return user.toObject();
    }
    return undefined;
  }

  async getUserById(id: string) {
    const user = await User.findById(id).exec();
    if (user) {
      return user.toObject();
    }
    return undefined;
  }
}
