import mongoose, { Schema, Document } from "mongoose";
import { BaseModel, IBase } from "./BaseModel";

export interface IMessage extends IBase {
  channelId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  content: string;
  type: "text" | "file" | "picture";
  fileUrl?: string;
  reactions: { userId: mongoose.Types.ObjectId; emoji: string }[];
}

const MessageSchema: Schema<IMessage> = new Schema<IMessage>({
  channelId: { type: Schema.Types.ObjectId, ref: "Channel" },
  senderId: { type: Schema.Types.ObjectId, ref: "User" },
  content: String,
  type: { type: String, enum: ["text", "file", "picture"] },
  fileUrl: String,
  reactions: [
    { userId: { type: Schema.Types.ObjectId, ref: "User" }, emoji: String },
  ],
});

export const Message = mongoose.model<IMessage>(
  "Message",
  MessageSchema
);
