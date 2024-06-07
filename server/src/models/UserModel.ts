import mongoose, { Schema, Document } from "mongoose";
import { BaseModel, IBase } from "./BaseModel";

export interface IUser extends IBase {
  username: string;
  email: string;
  password: string;
  channels: mongoose.Types.ObjectId[];
  blockedUsers: mongoose.Types.ObjectId[];
}

const UserSchema: Schema<IUser> = new Schema<IUser>({
  username: String,
  email: String,
  password: String,
  channels: [{ type: Schema.Types.ObjectId, ref: "Channel" }],
  blockedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export const User = mongoose.model<IUser>("User", UserSchema);
