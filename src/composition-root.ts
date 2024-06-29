import { AuthController } from "./features/auth/AuthController";
import { BlogController } from "./features/blogs/BlogController";
import { CommentController } from "./features/comments/CommentController";
import { PostController } from "./features/posts/PostController";
import { DeviceController } from "./features/securityDevices/DeviceController";
import { UserController } from "./features/users/UserController";
import { BlogQueryRepository, CommentQueryRepository, DeviceQueryRepository, PostQueryRepository, UserQueryRepository } from "./query_repositories";
import {
  AuthRepository,
  BlogRepository,
  CommentRepository,
  DeviceRepository,
  PostRepository,
  UserRepository,
} from "./repositories";
import {
  AuthService,
  BcryptService,
  BlogService,
  CommentService,
  DeviceService,
  EmailService,
  PostService,
  UserService,
} from "./services";

//REPOSITORIES
const authRepository = new AuthRepository();
const userRepository = new UserRepository();
const blogRepository = new BlogRepository();
const postRepository = new PostRepository();
const commentRepository = new CommentRepository();
const deviceRepository = new DeviceRepository();


//SERVICES
const bcryptService = new BcryptService();
export const emailService = new EmailService();
export const authService = new AuthService(
  authRepository,
  userRepository,
  bcryptService,
  emailService
);
const blogService = new BlogService(blogRepository, postRepository);
const commentService = new CommentService(commentRepository);
const postService = new PostService(blogRepository, postRepository);
const deviceService = new DeviceService(authRepository, deviceRepository);
const userService = new UserService(userRepository, bcryptService);


//QUERY-REPOSITORIES
const userQueryRepository = new UserQueryRepository();
const deviceQueryRepository = new DeviceQueryRepository();
const postQueryRepository = new PostQueryRepository();
const commentQueryRepository = new CommentQueryRepository();
const blogQueryRepository = new BlogQueryRepository();


//CONTROLLERS
export const userController = new UserController(userService, userQueryRepository);
export const authController = new AuthController(authService, userQueryRepository);
export const deviceController = new DeviceController(
  deviceService,
  deviceQueryRepository
);
export const blogController = new BlogController(blogService, blogQueryRepository);
export const postController = new PostController(
  postService,
  postQueryRepository,
  commentQueryRepository
);
export const commentController = new CommentController(
  commentService,
  commentQueryRepository
);