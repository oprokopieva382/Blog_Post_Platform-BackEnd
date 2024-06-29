import { Schema, model } from "mongoose";
import { CommentDBType } from "../cloud_DB";
import { LikeStatus } from "../types/LikesStatus";

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
      required: true,
      default: 0,
      min: 0,
    },
    dislikesCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    myStatus: {
      type: String,
      enum: Object.values(LikeStatus),
      default: LikeStatus.None,
    },
  },
  createdAt: { type: String, required: true },
});

export const CommentModel = model("comments", commentSchema);
