import { ObjectId } from "mongodb";
import { BlogInputModel, BlogViewModel } from "../models";
import { BlogDBType, blogsCollection } from "../cloud_DB";

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

  async removeBlog(id: string) {
    const blogToDelete = await blogsCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });
    if (!blogToDelete) {
      return null;
    }

    return mapBlogDBToView(blogToDelete);
  },

  async createBlog(data: BlogInputModel) {
    const newBlog = await blogsCollection.insertOne({
      _id: new ObjectId(),
      createdAt: new Date().toISOString(),
      ...data,
    });
    const insertedId = newBlog.insertedId;

    const createdBlog = this.getByIdBlog(insertedId.toString());
    return createdBlog;
  },

  async updateBlog(data: BlogInputModel, id: string) {
    const { name, description, websiteUrl } = data;
    await blogsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { name, description, websiteUrl } }
    );
    const updatedBlog = await blogsCollection.findOne({
      _id: new ObjectId(id),
    });

    return updatedBlog;
  },
};

export const mapBlogDBToView = (blog: BlogDBType): BlogViewModel => {
  return {
    // Convert ObjectId to string
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership:  false,
  };
};
