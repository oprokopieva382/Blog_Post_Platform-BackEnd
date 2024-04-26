import { ObjectId } from "mongodb";
import { CommentInputModel } from "../models";
import { CommentDBType } from "../cloud_DB/mongo_db_types";
import { commentsCollection } from "./../cloud_DB/mongo_db_atlas";

export const commentsRepository = {
  async getByIdComment(commentId: string): Promise<CommentDBType | null> {
    const foundComment = await commentsCollection.findOne({
      _id: new ObjectId(commentId),
    });
    return foundComment;
  },

  async removeComment(commentId: string) {
    const foundComment = await commentsCollection.findOneAndDelete({
      _id: new ObjectId(commentId),
    });
    return foundComment;
  },

  async updateComment(data: CommentInputModel, commentId: string) {
    const { content } = data;

    const updatedComment = await commentsCollection.findOneAndUpdate(
      { _id: new ObjectId(commentId) },
      {
        $set: {
          content,
        },
      }
    );

    return updatedComment;
  },
};
