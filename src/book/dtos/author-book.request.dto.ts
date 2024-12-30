import { Expose } from "class-transformer";
import { Length } from "class-validator";

export class AuthorBookRequestDto {
  @Length(2, 100, {
    message: "Title must be between 2 and 100 characters",
  })
  @Expose()
  title!: string;
}
