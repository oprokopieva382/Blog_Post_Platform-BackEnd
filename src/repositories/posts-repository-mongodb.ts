import { ObjectId } from "mongodb";
import { postsCollection } from "../cloud_DB/mongo_db_atlas";
import { PostDBType } from "../cloud_DB/mongo_db_types";
import { PostViewModel } from "../models/PostViewModel";

export const postsRepository = {
  async getAllPosts(): Promise<PostViewModel[]> {
    const posts: PostDBType[] = await postsCollection.find().toArray();
    const postsToView: PostViewModel[] = posts.map(mapPostDBToView);
    return postsToView;
  },

  async getByIdPost(id: string): Promise<PostViewModel | null> {
    const foundPost = await postsCollection.findOne({ _id: new ObjectId(id) });
    if (!foundPost) {
      return null;
    }
    return mapPostDBToView(foundPost);
  },
};

export const mapPostDBToView = (post: PostDBType): PostViewModel => {
  return {
    // Convert ObjectId to string
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId.toString(),
    blogName: post.blogName,
    createdAt: new Date().toISOString(),
  };
};
