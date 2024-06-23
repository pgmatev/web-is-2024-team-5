import mongoose, { Schema } from 'mongoose';
import { BaseSchema, IBase } from './BaseModel';

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
  isOnline: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  conversations: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: false,
    },
  ],
  blockedConversations: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: false,
    },
  ],
});

UserSchema.set('toObject', {
  transform: (doc, ret, options) => {
    delete ret.password;
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const User = mongoose.model<IUser>('User', UserSchema);
