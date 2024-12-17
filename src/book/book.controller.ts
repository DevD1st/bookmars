import { Request, Response, Router } from "express";

const bookController = Router();

bookController.get("/", (_: Request, res: Response) => {
  res.status(200).json({ message: "Book endpoint" });
});

export default bookController;
