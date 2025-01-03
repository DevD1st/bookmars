import { instanceToPlain, plainToInstance } from "class-transformer";
import { JwtPayload } from "../util";
import { Book } from "./book.entity";
import { AuthorBookRequestDto } from "./dtos/author-book.request.dto";
import { ResponseDto } from "../dtos/response.dto";
import { User } from "../user/user.entity";

class BookService {
  async authorBook({ id }: JwtPayload, { title }: AuthorBookRequestDto) {
    const book = plainToInstance(Book, { title, author: id });
    const authoredBook = await book.save();
    return new ResponseDto(201, "Book successfully created.", authoredBook);
  }

  async bookmarkBook({ id }: JwtPayload, bookId: number) {
    console.log("bookmarkBook()");

    const book = await Book.createQueryBuilder("book")
      .where({ id: bookId })
      .leftJoinAndSelect("book.bookmarkedBy", "bookmarkedBy")
      .getOne();
    if (!book) return new ResponseDto(400, "Book does not exist.");

    const user = await User.findOneBy({ id });
    if (!user) return new ResponseDto(400, "User does not exist.");

    book.bookmarkedBy = [...new Set([...(book.bookmarkedBy || []), user])];
    const savedBook = await book.save();

    return new ResponseDto(
      200,
      "Book successfully bookmarked.",
      instanceToPlain(savedBook)
    );
  }
}

export const bookService = new BookService();
