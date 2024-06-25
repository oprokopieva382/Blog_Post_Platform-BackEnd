import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";

const userSchema = new Schema({
  _id: { type: ObjectId, required: true },
  login: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: String, required: true },
  emailConfirmation: {
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true },
  },
});

export const UserModel = model("users", userSchema);
