import { Schema } from "mongoose";
import { LikeStatus } from "../types/LikesStatus";
import { ReactionModel } from "./ReactionBase";

const CommentReactionSchema = new Schema({
  comment: {
    type: Schema.Types.ObjectId,
    ref: "comments",
    required: true,
  },
  myStatus: {
    type: String,
    enum: Object.values(LikeStatus),
    default: LikeStatus.None,
    required: true,
  },
});

export const CommentReactionModel = ReactionModel.discriminator(
  "CommentReaction",
  CommentReactionSchema
);
