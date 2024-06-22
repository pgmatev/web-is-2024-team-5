import mongoose, { Schema } from 'mongoose';
import { BaseSchema, IBase } from './BaseModel';

export interface IConversation extends IBase {
  type: 'group' | 'private';
  participants: mongoose.Types.ObjectId[];
  messages: mongoose.Types.ObjectId[];
  groupInfo?: {
    name: string;
    adminId: mongoose.Types.ObjectId;
  }
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
    name: String,
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    required: false,
  },
  lastMessage: {
    date: Date,
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    text: String,
    required: false,
  }
});

ConversationSchema.add(BaseSchema);

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);
