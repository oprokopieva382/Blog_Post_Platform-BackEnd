import { Schema, model } from "mongoose";
import { ReactionCountDBType } from "../cloud_DB/mongo_db_types";

const ReactionCountSchema = new Schema<ReactionCountDBType>({
  _id: { type: Schema.Types.ObjectId, required: true },
  commentId: { type: String, required: true },
  likesCount: { type: Number, required: true },
  dislikesCount: { type: Number, required: true },
});

export const ReactionCountModel = model("reaction-count", ReactionCountSchema);
