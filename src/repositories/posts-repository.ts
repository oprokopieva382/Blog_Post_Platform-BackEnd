import { ObjectId } from "mongodb";
import { PostInputModel, PostViewModel } from "../models";
import { blogsRepository } from "./blogs-repository";
import { PostDBType, postsCollection } from "../cloud_DB";

export const postsRepository = {
  async getAllPosts(): Promise<PostDBType[]> {
    const posts: PostDBType[] = await postsCollection.find().toArray();
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
      createdAt: new Date().toISOString(),
    });
    const insertedId = newPost.insertedId;

    const createdPost = this.getByIdPost(insertedId.toString());
    return createdPost;
  },

  async updatePost(data: PostInputModel, id: string) {
    const { title, shortDescription, content, blogId } = data;
    const isBlogExist = await blogsRepository.getByIdBlog(blogId);

    await postsCollection.findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          title,
          shortDescription,
          content,
          blogId: new ObjectId(blogId),
          blogName: isBlogExist?.name,
        },
      }
    );

    const updatedPost = await postsCollection.findOne({
      _id: new ObjectId(id),
    });

    return updatedPost;
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
    createdAt: post.createdAt,
  };
};
