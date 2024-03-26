import Router, { Request, Response } from "express"

export const videosRouter = Router()

videosRouter.get("/", (req: Request, res: Response)=> {
})
videosRouter.get("/:id", (req: Request, res: Response) => {});
videosRouter.post("/", (req: Request, res: Response) => {});
videosRouter.put("/:id", (req: Request, res: Response) => {});
videosRouter.delete("/id", (req: Request, res: Response) => {});