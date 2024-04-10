import { ObjectId } from "mongodb";
import { blogsCollection } from "../cloud_DB/mongo_db_atlas";
import { BlogDBType } from "../cloud_DB/mongo_db_types";
import { BlogViewModel } from "../models/BlogViewModel";

export const blogsRepository = {
  async getAllBlogs(): Promise<BlogViewModel[]> {
    const blogs: BlogDBType[] = await blogsCollection.find().toArray();
    const blogsToView: BlogViewModel[] = blogs.map(mapBlogDBToView);
    return blogsToView;
  },

  async getByIdBlog(id: string): Promise<BlogViewModel | null> {
    const foundBlog = await blogsCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!foundBlog) {
      return null;
    }
    return mapBlogDBToView(foundBlog);
  },
};

export const mapBlogDBToView = (blog: BlogDBType): BlogViewModel => {
  return {
    // Convert ObjectId to string
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: new Date().toISOString(),
    isMembership: blog.isMembership || true,
  };
};
