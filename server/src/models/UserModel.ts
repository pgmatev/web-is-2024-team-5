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

UserSchema.set("toObject", {
  transform: (doc, ret, options) => {
    delete ret.password;
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const User = mongoose.model<IUser>("User", UserSchema);
