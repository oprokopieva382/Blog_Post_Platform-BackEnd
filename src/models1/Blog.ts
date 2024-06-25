import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";

const blogSchema = new Schema({
  _id: { type: ObjectId, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  createdAt: { type: String },
  isMembership: { type: Boolean },
});

export const BlogModel = model("blogs", blogSchema);
