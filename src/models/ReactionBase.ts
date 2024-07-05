import { Schema, model, Document } from "mongoose";
import { ReactionDBType } from "../cloud_DB/mongo_db_types";

const ReactionBaseSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, required: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    createdAt: { type: String, required: true },
  },
  { discriminatorKey: "category" }
);

export const ReactionModel = model<ReactionDBType & Document>(
  "reactions",
  ReactionBaseSchema
);
