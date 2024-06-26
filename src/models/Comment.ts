import { Schema, model } from "mongoose";
import { CommentDBType } from "../cloud_DB";

const commentSchema = new Schema<CommentDBType>({
  _id: { type: Schema.Types.ObjectId, required: true },
  postId: { type: String, required: true },
  content: { type: String, required: true },
  commentatorInfo: {
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
  },
  createdAt: { type: String, required: true },
});

export const CommentModel = model("comments", commentSchema);
