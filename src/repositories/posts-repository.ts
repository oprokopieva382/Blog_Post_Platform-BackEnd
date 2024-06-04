import { ObjectId } from "mongodb";
import { PostInputModel } from "../models";
import { PostDBType, postsCollection } from "../cloud_DB";
import { CommentDBType } from "../cloud_DB/mongo_db_types";
import { commentsCollection } from "./../cloud_DB/mongo_db_atlas";

export const postsRepository = {
  async getByIdPost(postId: string): Promise<PostDBType | null> {
    return await postsCollection.findOne({
      _id: new ObjectId(postId),
    });
  },

  async removePost(id: string) {
    return await postsCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });
  },

  async createPost(newPost: PostDBType) {
    return await postsCollection.insertOne(newPost);
  },

  async updatePost(data: PostInputModel, id: string, blogName: string) {
    const { title, shortDescription, content, blogId } = data;

    const updatedPost = await postsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          shortDescription,
          content,
          blogId: new ObjectId(blogId),
          blogName,
        },
      }
    );

    return updatedPost;
  },

  async getByIdComment(id: string): Promise<CommentDBType | null> {
    return await commentsCollection.findOne({
      _id: new ObjectId(id),
    });
  },

  async createComment(newComment: CommentDBType) {
    return await commentsCollection.insertOne(newComment);
  },
};
