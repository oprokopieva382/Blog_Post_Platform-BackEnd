import { ObjectId } from "mongodb";
import { BlogDBType } from "../cloud_DB";
import { BlogInputModel, BlogViewModel } from "../models";
import { blogsRepository } from "../repositories";

export const blogsService = {
  async getAllBlogs(): Promise<BlogViewModel[]> {
    const blogs: BlogDBType[] = await blogsRepository.getAllBlogs();
    const blogsToView: BlogViewModel[] = blogs.map(mapBlogDBToView);
    return blogsToView;
  },

  async getByIdBlog(id: string): Promise<BlogViewModel | null> {
    const foundBlog = await blogsRepository.getByIdBlog(id);
    return foundBlog ? mapBlogDBToView(foundBlog) : null;
  },

  async removeBlog(id: string) {
    const blogToDelete = await blogsRepository.removeBlog(id);
    return blogToDelete ? mapBlogDBToView(blogToDelete) : null;
  },

    async createBlog(data: BlogInputModel) {
      const newBlog = {
        _id: new ObjectId(),
        createdAt: new Date().toISOString(),
        ...data,
      };
      const createdBlog = await blogsRepository.createBlog(newBlog);
      const insertedId = createdBlog.insertedId;

      const createdBlogExist = this.getByIdBlog(insertedId.toString());
      return createdBlogExist;
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
    isMembership: false,
  };
};



//   async updateBlog(data: BlogInputModel, id: string) {
//     const { name, description, websiteUrl } = data;
//     await blogsCollection.findOneAndUpdate(
//       { _id: new ObjectId(id) },
//       { $set: { name, description, websiteUrl } }
//     );
//     const updatedBlog = await blogsCollection.findOne({
//       _id: new ObjectId(id),
//     });

//     return updatedBlog;
//   },
