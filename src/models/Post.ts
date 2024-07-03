import { Schema, model } from "mongoose";
import { PostDBType } from "../cloud_DB";

const postSchema = new Schema<PostDBType>({
  _id: { type: Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: Schema.Types.ObjectId, ref: "blogs", required: true },
  blogName: { type: String, required: true },
  createdAt: { type: String },
});

export const PostModel = model("posts", postSchema);
