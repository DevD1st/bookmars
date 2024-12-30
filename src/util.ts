import { validate } from "class-validator";
import { NextFunction, Request } from "express";
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

export function authenticate(req: Request) {
  const token = req.headers["authorization"]?.split(" ")[1];
  return jwt.verify(token || "", process.env.JWT_SECRET!) as JwtPayload;
}
