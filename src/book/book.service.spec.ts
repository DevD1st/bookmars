import { User } from "../user/user.entity";
import { Book } from "./book.entity";
import { bookService } from "./book.service";

describe("BookService", () => {
  const bookId = 1;
  const title = "My book";
  const authorId = 5;
  const email = "test@gmail.com";

  describe("authorBook", () => {
    describe("given a valid id and title", () => {
      it("should create a book successfully", async () => {
        jest.spyOn(Book.prototype, "save").mockResolvedValueOnce({
          id: bookId,
          title,
          author: authorId,
        } as any);

        const { message, statusCode, data } = await bookService.authorBook(
          { id: authorId, email },
          { title }
        );

        expect(statusCode).toBe(201);
        expect(message).toContain("success");
        expect((data as any)?.id).toBe(bookId);
        expect(Book.prototype.save).toHaveBeenCalled();
      });
    });

    describe("given null title", () => {
      it("Should throw an error", async () => {
        try {
          jest
            .spyOn(Book.prototype, "save")
            .mockRejectedValueOnce(new Error("Invalid body"));

          const res = await bookService.authorBook({ id: authorId, email }, {
            title: null,
          } as any);

          expect(res).rejects.toThrow("Invalid body");
          expect(Book.prototype.save).toHaveBeenCalled();
        } catch (error) {}
      });
    });
  });

  describe("bookmarkBook", () => {
    describe("given a valid bookId", () => {
      it("Should bookmark successfully", async () => {
        jest.spyOn(Book, "createQueryBuilder").mockReturnValueOnce({
          where: jest.fn().mockReturnThis(),
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValueOnce({
            id: bookId,
            title,
            bookmarkedBy: [],
            save: jest.fn().mockResolvedValueOnce({
              id: bookId,
              title,
              bookmarkedBy: [],
            }),
          }),
        } as any);

        jest.spyOn(User, "findOneBy").mockResolvedValueOnce({
          id: authorId,
          email,
          firstName: "",
          lastName: "",
          password: "",
          isActive: true,
        } as any);

        const { statusCode, message, data } = await bookService.bookmarkBook(
          { id: authorId, email },
          bookId
        );

        expect(statusCode).toBe(200);
        expect(message).toContain("success");
        expect((data as any)?.id).toBe(bookId);
      });
    });
  });
});
