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

const authRepository = new AuthRepository();
const userRepository = new UserRepository();
const blogRepository = new BlogRepository();
const postRepository = new PostRepository();
const commentRepository = new CommentRepository();
const deviceRepository = new DeviceRepository();

const bcryptService = new BcryptService();
const emailService = new EmailService();
const authService = new AuthService(
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
