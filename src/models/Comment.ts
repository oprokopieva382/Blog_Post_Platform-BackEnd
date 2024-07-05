import { Schema, model } from "mongoose";
import { CommentDBType } from "../cloud_DB";

const CommentSchema = new Schema<CommentDBType>({
  _id: { type: Schema.Types.ObjectId, required: true },
  post: {
    type: Schema.Types.ObjectId,
    ref: "posts",
  },
  content: { type: String, required: true },
  commentatorInfo: {
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
  },
  likesCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  dislikesCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  status: [
    {
      type: Schema.Types.ObjectId,
      ref: "CommentReaction",
    },
  ],

  createdAt: { type: String, required: true },
});

export const CommentModel = model("comments", CommentSchema);
