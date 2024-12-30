import { plainToInstance } from "class-transformer";
import { JwtPayload } from "../util";
import { Book } from "./book.entity";
import { AuthorBookRequestDto } from "./dtos/author-book.request.dto";
import { ResponseDto } from "../dtos/response.dto";

class BookService {
  async authorBook({ id }: JwtPayload, { title }: AuthorBookRequestDto) {
    const book = plainToInstance(Book, { title, author: id });
    const authoredBook = await book.save();
    return new ResponseDto(201, "Book successfully created.", authoredBook);
  }
}

export const bookService = new BookService();
