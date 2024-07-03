import { PostDBType } from "../cloud_DB";
import { PostViewModel } from "../type-models";

class PostDTO {
  static transform(post: PostDBType): PostViewModel {
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blog._id.toString(),
      blogName: post.blog.name,
      createdAt: post.createdAt,
    };
  }
}

export { PostDTO };