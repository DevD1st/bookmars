import { Request, Response, Router } from "express";

const authController = Router();

authController.post("/auth", (req: Request, res: Response) => {
  // TODO: Implement authentication logic
  res.status(200).json({ message: "Authentication endpoint" });
});

export default authController;
