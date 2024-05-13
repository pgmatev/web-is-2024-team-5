import mongoose, { Schema, Document } from 'mongoose';
import { BaseModel, IBase } from './BaseModel';

export interface IChannel extends IBase {
  name: string;
  admin: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  adminSettings: {
    allowInvites: boolean;
    allowEdits: boolean;
    allowDeletes: boolean;
  };
}

const ChannelSchema: Schema<IChannel> = new Schema<IChannel>({
  name: String,
  admin: { type: Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  adminSettings: {
    allowInvites: Boolean,
    allowBans: Boolean,
    allowEdits: Boolean,
    allowDeletes: Boolean
  }
});

export const Channel = mongoose.model<IChannel>('Channel', ChannelSchema);
