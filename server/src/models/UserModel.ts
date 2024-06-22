import mongoose, { Schema } from "mongoose";
import { IBase } from "./BaseModel";

export interface IUser extends IBase {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  isOnline: boolean; // online status
  isActive: boolean; // account status
  conversations: mongoose.Types.ObjectId[];
  blockedConversations: mongoose.Types.ObjectId[];
}

const UserSchema: Schema<IUser> = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  conversations: [
    {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: false,
    },
  ],
  blockedConversations: [
    {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: false,
    },
  ],
});

export const User = mongoose.model<IUser>("User", UserSchema);
