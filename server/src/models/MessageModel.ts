import mongoose, { Schema } from "mongoose";
import { IBase } from "./BaseModel";

export interface IMessage extends IBase {
  conversationId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  text?: string;
  attachments?: mongoose.Types.ObjectId[];
  reactions?: { userId: mongoose.Types.ObjectId; emoji: string }[];
  readBy?: mongoose.Types.ObjectId[];
}

const MessageSchema: Schema<IMessage> = new Schema<IMessage>({
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: false,
  },
  attachments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Attachment",
      required: false,
    },
  ],
  reactions: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      emoji: String,
      required: false,
    },
  ],
  readBy: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  ],
});

export const Message = mongoose.model<IMessage>(
  "Message",
  MessageSchema
);
