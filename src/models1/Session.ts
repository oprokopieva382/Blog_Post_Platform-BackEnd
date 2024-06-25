import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";

const sessionSchema = new Schema({
  _id: { type: ObjectId, required: true },
  userId: { type: String, required: true },
  deviceId: { type: String, required: true },
  iat: { type: String, required: true },
  deviceName: { type: String, required: true },
  ip: { type: String, required: true },
  exp: { type: String, required: true },
});

export const SessionModel = model("sessions", sessionSchema);
