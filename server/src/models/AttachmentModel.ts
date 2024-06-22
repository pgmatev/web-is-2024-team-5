import mongoose, { Schema } from 'mongoose';
import { BaseSchema, IBase } from './BaseModel';

export interface IAttachment extends IBase {
  messageId: mongoose.Types.ObjectId;
  url: string;
  metadata: {
    mimeType: string;
    extension: string;
    size: number;
  };
}

const AttachmentSchema: Schema<IAttachment> = new Schema<IAttachment>({
  messageId: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  metadata: {
    mimeType: {
      type: String,
      required: true,
    },
    extension: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
  },
});

AttachmentSchema.add(BaseSchema);

export const Attachment = mongoose.model<IAttachment>('Attachment', AttachmentSchema);
