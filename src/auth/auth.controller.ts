import { plainToInstance } from "class-transformer";
import { NextFunction, Request, Response, Router } from "express";
import { CreateUserRequestDto } from "../user/dtos/create-user-request.dto";
import { validateDto } from "../util";
import { userService } from "../user/user.service";

const authController = Router();

authController.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const dto = plainToInstance(CreateUserRequestDto, body);

    const isValid = await validateDto(dto, next);
    if (!isValid) return;

    const resObj = await userService.signup(dto);
    res.status(resObj.statusCode).json(resObj);
  }
);

export default authController;
