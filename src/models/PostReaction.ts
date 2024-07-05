import { Schema } from "mongoose";
import { LikeStatus } from "../types/LikesStatus";
import { ReactionModel } from "./ReactionBase";

const PostReactionSchema = new Schema({
  post: {
    type: Schema.Types.ObjectId,
    ref: "posts",
    required: true,
  },
  myStatus: {
    type: String,
    enum: Object.values(LikeStatus),
    default: LikeStatus.None,
    required: true,
  },
});

export const PostReactionModel = ReactionModel.discriminator(
  "PostReaction",
  PostReactionSchema
);
