import Router from "express";
import { testingController } from "./testingController";

export const testingRouter = Router();

testingRouter.delete("/all-data", async (req, res) =>
  await testingController(req, res)
);