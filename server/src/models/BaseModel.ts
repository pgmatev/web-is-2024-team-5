import mongoose, { Document, Schema } from "mongoose";

export interface IBase extends Document {
  createdAt: Date;
  updatedAt: Date;
}

export const BaseSchema: Schema<IBase> = new Schema<IBase>(
  {},
  {
    timestamps: true,
    versionKey: false, // Disabling version key "__v"
  }
);

export const BaseModel = mongoose.model<IBase>("Base", BaseSchema);
