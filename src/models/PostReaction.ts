import { Schema } from "mongoose";
import { LikeStatus } from "../types/LikesStatus";
import { ReactionModel } from "./ReactionBase";
import { LikeDetailsDBType, PostReactionDBType } from "../cloud_DB/mongo_db_types";

const LatestReactionSchema = new Schema<LikeDetailsDBType>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  addedAt: {
    type: String,
    required: true,
  },
});

const PostReactionSchema = new Schema<PostReactionDBType>({
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
  latestReactions: {
    type: [LatestReactionSchema],
    default: [],
  }

});

export const PostReactionModel = ReactionModel.discriminator(
  "PostReaction",
  PostReactionSchema
);
