import { Schema, model } from "mongoose";
import { PasswordRecoveryDBType } from "../cloud_DB";

const passwordSchema = new Schema<PasswordRecoveryDBType>({
  _id: { type: Schema.Types.ObjectId, required: true },
  recoveryCode: { type: String, required: true },
  email: { type: String, required: true },
  expirationDate: { type: Date, required: true },
  createdAt: { type: String },
});

export const PasswordModel = model("password-recovery", passwordSchema);
