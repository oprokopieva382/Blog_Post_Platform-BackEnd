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
  likesInfo: {
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
    myStatus: [
      {
        type: Schema.Types.ObjectId,
        ref: "comment-reactions",
      },
    ],
  },

  createdAt: { type: String, required: true },
});

export const CommentModel = model("comments", commentSchema);
