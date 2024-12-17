import { Request, Response, Router } from "express";

const profileController = Router();

profileController.get("/", (_: Request, res: Response) => {
  res.status(200).json({ message: "Profile endpoint" });
});

export default profileController;
