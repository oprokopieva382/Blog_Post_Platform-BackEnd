import { ObjectId } from "mongodb";
import { PostInputModel } from "../type-models";
import { PostDBType } from "../cloud_DB";
import { CommentDBType } from "../cloud_DB/mongo_db_types";
import { CommentModel, PostModel } from "../models";

export class PostRepository {
  async getByIdPost(postId: string): Promise<PostDBType | null> {
    return await PostModel.findOne({
      _id: new ObjectId(postId),
    }).populate("blog");
  }

  async removePost(id: string) {
    return await PostModel.findOneAndDelete({
      _id: new ObjectId(id),
    });
  }

  async createPost(newPost: PostDBType) {
    return await PostModel.create(newPost);
  }

  async updatePost(data: PostInputModel, id: string, blogName: string) {
    const { title, shortDescription, content, blogId } = data;

    const updatedPost = await PostModel.findOneAndUpdate(
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
  }

  async getByIdComment(id: string): Promise<CommentDBType | null> {
    return await CommentModel.findOne({
      _id: new ObjectId(id),
    }).populate(["post", "likesInfo.status"]);
  }

  async createComment(
    newComment: CommentDBType
  ): Promise<CommentDBType | null> {
    return await CommentModel.create(newComment);
  }
}
