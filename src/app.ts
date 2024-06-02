import express from "express";
import { SETTINGS } from "./settings";
import { postsRouter } from "./features/posts/postsRouter";
import { blogsRouter } from "./features/blogs/blogsRouter";
import { testingRouter } from "./features/dbCleanUp/testingRouter";
import { usersRouter } from "./features/users/usersRouter";
import { authRouter } from "./features/auth/authRouter";
import { commentsRouter } from "./features/comments/commentsRouter";
import cookieParser from "cookie-parser";
import { errorHandlerMiddleware } from "./middlewares";

export const app = express();

//use middleware to be able have access to body and query of all needed requests
app.use(cookieParser());
app.use(express.json());
app.use(SETTINGS.PATH.TESTING, testingRouter);
app.use(SETTINGS.PATH.AUTH, authRouter);
app.use(SETTINGS.PATH.POSTS, postsRouter);
app.use(SETTINGS.PATH.BLOGS, blogsRouter);
app.use(SETTINGS.PATH.USERS, usersRouter);
app.use(SETTINGS.PATH.COMMENTS, commentsRouter);
app.use(errorHandlerMiddleware);

app.get("/", (req, res) => {
  //endpoint to display backend version in use
  res.status(200).json({ version: "1.0" });
});
