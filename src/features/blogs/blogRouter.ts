import { Router } from "express";
import {
  isAdminMiddleware,
  validatePostOfBlog,
  validateBlog,
} from "../../middlewares";
import { container } from "../../composition-root";
import { BlogController } from "./BlogController";

const blogController = container.resolve(BlogController);
export const blogRouter = Router();

blogRouter.get("/", blogController.getAll.bind(blogController));

blogRouter.get("/:id", blogController.getById.bind(blogController));
blogRouter.get(
  "/:blogId/posts",
  blogController.getBlogPosts.bind(blogController)
);

blogRouter.delete(
  "/:id",
  isAdminMiddleware,
  blogController.deleteById.bind(blogController)
);

blogRouter.post(
  "/",
  isAdminMiddleware,
  validateBlog,
  blogController.create.bind(blogController)
);

blogRouter.post(
  "/:blogId/posts",
  isAdminMiddleware,
  validatePostOfBlog,
  blogController.createBlogPost.bind(blogController)
);

blogRouter.put(
  "/:id",
  isAdminMiddleware,
  validateBlog,
  blogController.update.bind(blogController)
);
