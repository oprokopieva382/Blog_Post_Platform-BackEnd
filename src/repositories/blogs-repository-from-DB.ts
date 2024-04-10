import { blogsCollection } from "../cloud_DB/mongo_db_atlas";
import { BlogDBType } from "../cloud_DB/mongo_db_types";
import { BlogViewModel } from "../models/BlogViewModel";

export const blogsRepository = {
  async getAllBlogs(): Promise<BlogViewModel[]> {
    const blogs: BlogDBType[] = await blogsCollection.find().toArray();
    const blogsToView: BlogViewModel[] = blogs.map(mapBlogDBToViewModel);
    return blogsToView;
  },
};

export const mapBlogDBToViewModel = (blog: BlogDBType): BlogViewModel => {
  return {
    // Convert ObjectId to string
    id: blog._id.toHexString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
};