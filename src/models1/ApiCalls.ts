import { Schema, model } from "mongoose";

const apiCallSchema = new Schema({
  IP: { type: String, required: true },
  URL: { type: String, required: true },
  date: { type: Date, required: true },
});

export const ApiCallModel = model("apiCalls", apiCallSchema);
