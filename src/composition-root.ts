import "reflect-metadata";
import { AuthController } from "./features/auth/AuthController";
import { BlogController } from "./features/blogs/BlogController";
import { CommentController } from "./features/comments/CommentController";
import { PostController } from "./features/posts/PostController";
import { DeviceController } from "./features/securityDevices/DeviceController";
import { UserController } from "./features/users/UserController";
import {
  BlogQueryRepository,
  CommentQueryRepository,
  DeviceQueryRepository,
  PostQueryRepository,
  UserQueryRepository,
} from "./query_repositories";
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
import { Container } from "inversify";
import { AuthDTO, CommentDTO, PostDTO } from "./DTO";



//SERVICES
//const bcryptService = new BcryptService();
//export const emailService = new EmailService();
//export const jwtService = new JwtService();
// export const authService = new AuthService(
//   authRepository,
//   userRepository,
//   bcryptService,
//   emailService,
//   jwtService
// );
//const blogService = new BlogService(blogRepository, postRepository);
//const commentService = new CommentService(commentRepository);
//const postService = new PostService(blogRepository, postRepository);
//const deviceService = new DeviceService(authRepository, deviceRepository);
//const userService = new UserService(userRepository, bcryptService);



//CONTROLLERS
// export const userController = new UserController(
//   userService,
//   userQueryRepository
// );
// const authController = new AuthController(
//   authService,
//   userQueryRepository
// );
// export const deviceController = new DeviceController(
//   deviceService,
//   deviceQueryRepository
// );
// export const blogController = new BlogController(
//   blogService,
//   blogQueryRepository
// );
// export const postController = new PostController(
//   postService,
//   postQueryRepository,
//   commentQueryRepository
// );
// export const commentController = new CommentController(
//   commentService,
//   commentQueryRepository
// );


//REPOSITORIES
//export const authRepository = new AuthRepository();
//const userRepository = new UserRepository();
//export const blogRepository = new BlogRepository();
//const postRepository = new PostRepository();
//export const commentRepository = new CommentRepository();
//const deviceRepository = new DeviceRepository();

//QUERY-REPOSITORIES
//export const userQueryRepository = new UserQueryRepository();
//const deviceQueryRepository = new DeviceQueryRepository();
//export const postQueryRepository = new PostQueryRepository();
//export const commentQueryRepository = new CommentQueryRepository();
//const blogQueryRepository = new BlogQueryRepository();

export const container = new Container();
container.bind(UserController).to(UserController);
container.bind(AuthController).to(AuthController);
container.bind(DeviceController).to(DeviceController);
container.bind(BlogController).to(BlogController);
container.bind(PostController).to(PostController);
container.bind(CommentController).to(CommentController);

container.bind(AuthService).to(AuthService)
container.bind(BcryptService).to(BcryptService);
container.bind(EmailService).to(EmailService);
container.bind(JwtService).to(JwtService);
container.bind(BlogService).to(BlogService);
container.bind(CommentService).to(CommentService);
container.bind(PostService).to(PostService);
container.bind(DeviceService).to(DeviceService);
container.bind(UserService).to(UserService);

container.bind(AuthRepository).to(AuthRepository);
container.bind(UserRepository).to(UserRepository);
container.bind(BlogRepository).to(BlogRepository);
container.bind(PostRepository).to(PostRepository);
container.bind(CommentRepository).to(CommentRepository);
container.bind(DeviceRepository).to(DeviceRepository);

container.bind(UserQueryRepository).to(UserQueryRepository);
container.bind(DeviceQueryRepository).to(DeviceQueryRepository);
container.bind(PostQueryRepository).to(PostQueryRepository);
container
  .bind(CommentQueryRepository)
  .to(CommentQueryRepository);
container.bind(BlogQueryRepository).to(BlogQueryRepository);

container.bind(CommentDTO).to(CommentDTO);
container.bind(PostDTO).to(PostDTO);
container.bind(AuthDTO).to(AuthDTO);