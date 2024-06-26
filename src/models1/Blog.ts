import { Schema, model } from "mongoose";
import { BlogDBType } from "../cloud_DB";

const blogSchema = new Schema<BlogDBType>({
  _id: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  createdAt: { type: String },
  isMembership: { type: Boolean },
});

export const BlogModel = model("blogs", blogSchema);
