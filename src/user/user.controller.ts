import { plainToInstance } from "class-transformer";
import { NextFunction, Request, Response, Router } from "express";
import { CreateUserRequestDto } from "./dtos/create-user-request.dto";
import { validateDto } from "../util";
import { userService } from "./user.service";

const userController = Router();

userController.post(
  "signup",
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const dto = plainToInstance(CreateUserRequestDto, body);

    const isValid = await validateDto(dto, next);
    if (!isValid) return;

    const resObj = await userService.signup(dto);
    res.status(resObj.statusCode).json(resObj);
  }
);

export default userController;
