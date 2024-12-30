import { plainToInstance } from "class-transformer";
import { NextFunction, Request, Response, Router } from "express";
import { CreateUserRequestDto } from "../user/dtos/create-user-request.dto";
import { validateDto } from "../util";
import { userService } from "../user/user.service";
import { SigninRequestDto } from "../user/dtos/signin-request.dto";
import { ResponseDto } from "../dtos/response.dto";

const authController = Router();

authController.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      const dto = plainToInstance(CreateUserRequestDto, body);

      const isValid = await validateDto(dto, next);
      if (!isValid) return;

      const resObj = await userService.signup(dto);
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

authController.post(
  "/signin",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = plainToInstance(SigninRequestDto, req.body);

      const isValid = await validateDto(dto, next);
      if (!isValid) return;

      const resObj = await userService.signin(dto);
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

export default authController;
