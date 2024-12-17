import { Request, Response, Router } from "express";

const userController = Router();

userController.get("/", (_: Request, res: Response) => {
  res.status(200).json({ message: "User endpoint" });
});

export default userController;
