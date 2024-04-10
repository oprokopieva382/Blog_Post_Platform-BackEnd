import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { blogsController } from "./blogsController";
import { blogValidationMiddleware } from "../../middlewares/blogValidationMiddleware";

export const blogsRouter = Router();

blogsRouter.get("/", async (req, res) => {
  await blogsController.getAll(req, res);
});
blogsRouter.get("/:id", async (req, res) => {
  await blogsController.getById(req, res);
});
blogsRouter.delete("/:id", authMiddleware, async (req, res) => {
  blogsController.deleteById(req, res);
});
// blogsRouter.post(
//   "/",
//   authMiddleware,
//   blogValidationMiddleware,
//   blogsController.create()
// );
// blogsRouter.put(
//   "/:id",
//   authMiddleware,
//   blogValidationMiddleware,
//   blogsController.update()
// );
