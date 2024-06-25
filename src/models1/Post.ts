import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";

const postSchema = new Schema({
  _id: { type: ObjectId, required: true },
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: ObjectId, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: String },
});

export const PostModel = model("posts", postSchema);
