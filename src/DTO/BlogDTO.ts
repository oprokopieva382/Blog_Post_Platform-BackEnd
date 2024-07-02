import { BlogDBType } from "../cloud_DB";
import { BlogViewModel } from "../type-models";

class BlogDTO {
  static transform(blog: BlogDBType): BlogViewModel {
    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: false,
    };
  }
}
export { BlogDTO };
