import { PostViewModel } from "../models";
import { PostDBType} from "../cloud_DB";
import { postsRepository } from "../repositories";

export const postsService = {
  async getAllPosts(): Promise<PostViewModel[]> {
    const posts: PostDBType[] = await postsRepository.getAllPosts();
    const postsToView: PostViewModel[] = posts.map(mapPostDBToView);
    return postsToView;
  },

  async getByIdPost(id: string): Promise<PostViewModel | null> {
    const foundPost = await postsRepository.getByIdPost(id);
    return foundPost ? mapPostDBToView(foundPost) : null;
  },

  async removePost(id: string) {
    const foundPost = await postsRepository.removePost(id)
    return foundPost ? mapPostDBToView(foundPost) : null;
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

   // async createPost(data: PostInputModel) {
  //   const { title, shortDescription, content, blogId } = data;

  //   const isBlogExist = await blogsRepository.getByIdBlog(blogId);
  //   if (!isBlogExist) {
  //     return null;
  //   }

  //   const newPost = await postsCollection.insertOne({
  //     _id: new ObjectId(),
  //     title,
  //     shortDescription,
  //     content,
  //     blogId: new ObjectId(blogId),
  //     blogName: isBlogExist.name,
  //     createdAt: new Date().toISOString(),
  //   });
  //   const insertedId = newPost.insertedId;

  //   const createdPost = this.getByIdPost(insertedId.toString());
  //   return createdPost;
  // },

 

  // async updatePost(data: PostInputModel, id: string) {
  //   const { title, shortDescription, content, blogId } = data;
  //   const isBlogExist = await blogsRepository.getByIdBlog(blogId);

  //   await postsCollection.findOneAndUpdate(
  //     {
  //       _id: new ObjectId(id),
  //     },
  //     {
  //       $set: {
  //         title,
  //         shortDescription,
  //         content,
  //         blogId: new ObjectId(blogId),
  //         blogName: isBlogExist?.name,
  //       },
  //     }
  //   );

  //   const updatedPost = await postsCollection.findOne({
  //     _id: new ObjectId(id),
  //   });

  //   return updatedPost;
  // },

