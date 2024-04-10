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
blogsRouter.post(
  "/",
  authMiddleware,
  blogValidationMiddleware,
  async (req, res) => {
    blogsController.create(req, res);
  }
);
// blogsRouter.put(
//   "/:id",
//   authMiddleware,
//   blogValidationMiddleware,
//   blogsController.update()
// );
