import { ObjectId } from "mongodb";
import { PostInputModel } from "../models";
import { PostDBType, postsCollection } from "../cloud_DB";
import { QueryType } from "../features/blogs";

export const postsRepository = {
  async getAllPosts(
    searchQueryTitle: any,
    query: QueryType
  ): Promise<PostDBType[]> {
    const posts: PostDBType[] = await postsCollection
      .find(searchQueryTitle)
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      .sort(query.sortBy, query.sortDirection)
      .toArray();
    return posts;
  },

  async getByIdPost(id: string): Promise<PostDBType | null> {
    const foundPost = await postsCollection.findOne({ _id: new ObjectId(id) });
    return foundPost;
  },

  async removePost(id: string) {
    const foundPost = await postsCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });
    return foundPost;
  },

  async createPost(newPost: PostDBType) {
    const createdPost = await postsCollection.insertOne(newPost);
    return createdPost;
  },

  async updatePost(data: PostInputModel, id: string, blogName: string) {
    const { title, shortDescription, content, blogId } = data;

    const updatedPost = await postsCollection.findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
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
};
