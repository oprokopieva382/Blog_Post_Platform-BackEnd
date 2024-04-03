import express from "express";
import { SETTINGS } from "./settings";
//import { testingRouter } from "./features/dbCleanUp/testingRouter";
import { postsRouter } from "./features/posts/postsRouter";
import { blogsRouter } from "./features/blogs/blogsRouter";

export const app = express();

//use middleware to be able have access to body and query of all needed requests
app.use(express.json());
//app.use(SETTINGS.PATH.VIDEOS, videosRouter);
//app.use(SETTINGS.PATH.TESTING, testingRouter);
app.use(SETTINGS.PATH.POSTS, postsRouter);
app.use(SETTINGS.PATH.BLOGS, blogsRouter);

app.get("/", (req, res) => {
  //endpoint to display backend version in use
  res.status(200).json({ version: "1.0" });
});
