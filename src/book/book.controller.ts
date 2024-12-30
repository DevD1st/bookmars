import { NextFunction, Request, Response, Router } from "express";
import { ResponseDto } from "../dtos/response.dto";
import { plainToClass } from "class-transformer";
import { AuthorBookRequestDto } from "./dtos/author-book.request.dto";
import { authenticate, validateDto } from "../util";
import { bookService } from "./book.service";

const bookController = Router();

bookController.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jwtPayload = authenticate(req);

      const dto = plainToClass(AuthorBookRequestDto, req.body, {
        excludeExtraneousValues: true,
      });
      const isDtoValid = await validateDto(dto, next);
      if (!isDtoValid) return;

      const resObj = await bookService.authorBook(jwtPayload, dto);
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

export default bookController;
