import express from "express";
import cookieParser from "cookie-parser";
import { SETTINGS } from "./settings";
import { postRouter } from "./features/posts/postRouter";
import { blogRouter } from "./features/blogs/blogRouter";
import { testingRouter } from "./features/dbCleanUp/testingRouter";
import { userRouter } from "./features/users/userRouter";
import { authRouter } from "./features/auth/authRouter";
import { commentRouter } from "./features/comments/commentRouter";
import { errorHandlerMiddleware } from "./middlewares";
import { deviceRouter } from "./features/securityDevices/deviceRouter";
import { logger } from "./utils/logger";

export const app = express();

//use middleware to be able have access to body and query of all needed requests
app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", true); // for learning purpose only, not for production
app.use(SETTINGS.PATH.TESTING, testingRouter);
app.use(SETTINGS.PATH.AUTH, authRouter);
app.use(SETTINGS.PATH.POSTS, postRouter);
app.use(SETTINGS.PATH.BLOGS, blogRouter);
app.use(SETTINGS.PATH.USERS, userRouter);
app.use(SETTINGS.PATH.COMMENTS, commentRouter);
app.use(SETTINGS.PATH.SECURITY_DEVICES, deviceRouter);
app.use(errorHandlerMiddleware);

app.get("/", (req, res) => {
  //endpoint to display backend version in use
  res.status(200).json({ version: SETTINGS.VERSION });
});

logger.info("Server started");
