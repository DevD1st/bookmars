import { validate } from "class-validator";
import { NextFunction } from "express";
import { ResponseDto } from "./dtos/response.dto";
import * as jwt from "jsonwebtoken";

export const validateDto = async (dto: object, next: NextFunction) => {
  const errors = await validate(dto);
  if (errors.length) {
    const errorResponse = new ResponseDto(
      400,
      errors[0].constraints?.[Object.keys(errors[0].constraints || {})[0]] ||
        "Error occurred."
    );
    return next(errorResponse);
  }

  return true;
};

export interface JwtPayload {
  email: string;
}

export const generateToken = (payload: JwtPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
};
