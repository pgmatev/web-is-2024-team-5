import mongoose, { Schema } from 'mongoose';
import { BaseSchema, IBase } from './BaseModel';
import { string } from 'zod';

export interface IConversation extends IBase {
  type: 'group' | 'private';
  participants: mongoose.Types.ObjectId[];
  messages: mongoose.Types.ObjectId[];
  groupInfo?: {
    name?: string;
    adminId: mongoose.Types.ObjectId;
  };
  lastMessage?: {
    id: mongoose.Types.ObjectId;
    date: Date;
    sender: mongoose.Types.ObjectId;
    text: string;
  };
}

const ConversationSchema: Schema<IConversation> = new Schema<IConversation>({
  type: {
    type: String,
    enum: ['group', 'private'],
    required: true,
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      required: false,
    },
  ],
  groupInfo: {
    name: {
      type: String,
      required: false,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  lastMessage: {
    date: Date,
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    text: String,
  },
});

ConversationSchema.add(BaseSchema);

ConversationSchema.set('toObject', {
  transform: (doc, ret, options) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Conversation = mongoose.model<IConversation>(
  'Conversation',
  ConversationSchema,
);
