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
  JwtService,
  PostService,
  UserService,
} from "./services";

//REPOSITORIES
export const authRepository = new AuthRepository();
const userRepository = new UserRepository();
export const blogRepository = new BlogRepository();
const postRepository = new PostRepository();
export const commentRepository = new CommentRepository();
const deviceRepository = new DeviceRepository();


//SERVICES
const bcryptService = new BcryptService();
export const emailService = new EmailService();
export const jwtService = new JwtService();
export const authService = new AuthService(
  authRepository,
  userRepository,
  bcryptService,
  emailService,
  jwtService
);
const blogService = new BlogService(blogRepository, postRepository);
const commentService = new CommentService(commentRepository);
const postService = new PostService(blogRepository, postRepository);
const deviceService = new DeviceService(authRepository, deviceRepository);
const userService = new UserService(userRepository, bcryptService);


//QUERY-REPOSITORIES
export const userQueryRepository = new UserQueryRepository();
const deviceQueryRepository = new DeviceQueryRepository();
const postQueryRepository = new PostQueryRepository();
export const commentQueryRepository = new CommentQueryRepository();
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