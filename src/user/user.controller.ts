import { NextFunction, Request, Response, Router } from "express";
import { authenticate, validateDto } from "../util";
import { userService } from "./user.service";
import { ResponseDto } from "../dtos/response.dto";

const userController = Router();

userController.get(
  "/fetch",
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const url = new URL("http://" + process.env.HOST + req.url);
      const populate = url.searchParams.get("populate");

      const { email } = authenticate(req);

      const resObj = await userService.fetchUser(
        { email },
        populate || undefined
      );
      res.status(resObj.statusCode).json(resObj);
    } catch (error: any) {
      console.error(error);

      res
        .status(error.statusCode || 400)
        .json(
          new ResponseDto(
            error.statusCode || 400,
            error.message || "Error occurred."
          )
        );
    }
  }
);

export default userController;
