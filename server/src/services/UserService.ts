import {z} from "zod";
import {IUser, User} from "../models/UserModel";

export const CreateUserSchema = z.object({
    email: z.string().email(),
    name: z.string(),
    password: z.string(),
});

type UserInput = z.infer<typeof CreateUserSchema>;

export class UserService {
    async createUser(user: UserInput) {
        return await User.create(user);
    }

    async findUserByEmail(email: string) {
        return await User.findOne({email: email});
    }
}
