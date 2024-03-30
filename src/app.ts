import express from "express";
import { SETTINGS } from "./settings";
import { videosRouter } from "./features/videos/videosRouter";
import { testingRouter } from "./features/dbCleanUp/testingRouter";

export const app = express();

//use middleware to be able have access to body and query of all needed requests
app.use(express.json());
app.use(SETTINGS.PATH.TESTING, testingRouter);
app.use(SETTINGS.PATH.VIDEOS, videosRouter);

app.get("/", (req, res) => {
  //endpoint to display backend version in use
  res.status(200).json({ version: "1.0" });
});
