import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import authController from "./auth/auth.controller";
import userController from "./user/user.controller";
import profileController from "./profile/profile.controller";
import bookController from "./book/book.controller";
import { ResponseDto } from "./dtos/response.dto";
import * as path from "path";
import { config } from "dotenv";
const res = config({
  path: path.join(process.cwd(), "src", `.env.${process.env.NODE_ENV}`),
});

function createServer() {
  const app = express();

  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  app.use(express.json({}));

  app.get("/", (_, res) => {
    res.send("Hello World");
  });

  app.use("/auth", authController);
  app.use("/user", userController);
  app.use("/profile", profileController);
  app.use("/book", bookController);

  // error boundary
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.log("\n");
    console.log("Error occurred");
    console.error(JSON.stringify(err));
    console.log("\n");

    const statusCode =
      (err as any as ResponseDto)?.statusCode || res.statusCode || 500;

    res
      .status(statusCode)
      .json(new ResponseDto(statusCode, err.message || "Error occurred."));
  });

  return app;
}

export default createServer;
