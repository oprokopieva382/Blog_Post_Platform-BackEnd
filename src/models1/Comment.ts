import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";

const commentSchema = new Schema({
  _id: { type: ObjectId, required: true },
  postId: { type: String, required: true },
  content: { type: String, required: true },
  commentatorInfo: {
    userId: { type: String, required: true },
    userLogin: { type: Date, required: true },
  },
  createdAt: { type: String, required: true },
});

export const CommentModel = model("comments", commentSchema);
