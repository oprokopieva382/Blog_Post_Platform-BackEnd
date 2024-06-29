import { AuthRepository, BlogRepository, CommentRepository, DeviceRepository, PostRepository, UserRepository } from "./repositories";
import { BcryptService, EmailService } from "./services";

const authRepository = new AuthRepository();
const userRepository = new UserRepository();
const blogRepository = new BlogRepository();
const postRepository = new PostRepository();
const commentRepository = new CommentRepository();
const deviceRepository = new DeviceRepository();

const bcryptService = new BcryptService();
const emailService = new EmailService();