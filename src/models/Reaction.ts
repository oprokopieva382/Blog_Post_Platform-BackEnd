import { Schema, model } from "mongoose";
import { ReactionDBType } from "../cloud_DB/mongo_db_types";
import { LikeStatus } from "../types/LikesStatus";

const ReactionSchema = new Schema<ReactionDBType>({
  _id: { type: Schema.Types.ObjectId, required: true },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  myStatus: {
    type: [
      {
        type: String,
        enum: Object.values(LikeStatus),
        default: LikeStatus.None,
        required: true,
      },
    ],
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: "comments",
  },
  createdAt: { type: String, required: true },
});

export const ReactionModel = model("comment-reactions", ReactionSchema);
