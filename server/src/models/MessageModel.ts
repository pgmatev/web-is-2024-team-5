import mongoose, { Schema } from 'mongoose';
import { BaseSchema, IBase } from './BaseModel';

export interface IMessage extends IBase {
  conversation: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  text?: string;
  attachments?: mongoose.Types.ObjectId[];
  reactions?: { userId: mongoose.Types.ObjectId; emoji: string }[];
  readBy?: mongoose.Types.ObjectId[];
}

const MessageSchema: Schema<IMessage> = new Schema<IMessage>({
  conversation: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  text: {
    type: String,
    required: false,
    index: true,
  },
  attachments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Attachment',
      required: false,
    },
  ],
  reactions: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      emoji: String,
    },
  ],
  readBy: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  ],
});

MessageSchema.add(BaseSchema);

MessageSchema.set('toObject', {
  transform: (doc, ret, options) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
