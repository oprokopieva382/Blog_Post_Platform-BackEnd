import { ObjectId } from "mongodb";
import { blogsCollection, postsCollection } from "../cloud_DB/mongo_db_atlas";
import { PostDBType } from "../cloud_DB/mongo_db_types";
import { PostViewModel } from "../models/PostViewModel";
import { PostInputModel } from "../models/PostInputModel";
import { blogsController } from "../features/blogs/blogsController";
import { blogsRepository } from "./blogs-repository";

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

  async createPost(data: PostInputModel) {
    const { title, shortDescription, content, blogId } = data;

    const isBlogExist = await blogsRepository.getByIdBlog(blogId);
    if (!isBlogExist) {
      return null;
    }

    const newPost = await postsCollection.insertOne({
      _id: new ObjectId(),
      title,
      shortDescription,
      content,
      blogId: new ObjectId(blogId),
      blogName: isBlogExist.name,
    });
    const insertedId = newPost.insertedId;

    const createdPost = this.getByIdPost(insertedId.toString());
    return createdPost;
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
