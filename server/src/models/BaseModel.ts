import mongoose, { Schema, Document } from "mongoose";

export interface IBase extends Document {
  createdAt: Date;
  updatedAt: Date;
}

const BaseSchema: Schema<IBase> = new Schema<IBase>(
  {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false, // Disabling version key "__v"
  }
);

BaseSchema.pre("save", function (this: IBase, next) {
  this.updatedAt = new Date();
  next();
});

export const BaseModel = mongoose.model<IBase>("Base", BaseSchema);
