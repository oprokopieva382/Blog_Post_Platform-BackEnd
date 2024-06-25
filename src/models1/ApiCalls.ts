import { Schema, model } from "mongoose";
import { ApiDBType } from "../cloud_DB/mongo_db_types";

const apiCallSchema = new Schema<ApiDBType>({
  IP: { type: String, required: true },
  URL: { type: String, required: true },
  date: { type: Date, required: true },
});

export const ApiCallModel = model("apiCalls", apiCallSchema);
