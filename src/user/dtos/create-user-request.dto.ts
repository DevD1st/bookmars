import {
  IsArray,
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  ValidateNested,
} from "class-validator";
import { AuthorBookRequestDto } from "../../book/dtos/author-book.request.dto";
import { Type } from "class-transformer";

export class CreateUserRequestDto {
  @IsEmail({}, { message: "Please input a valid email." })
  email!: string;

  @IsString({ message: "Please input a valid first name" })
  @Length(2, 100, {
    message: "First name must be between 2 and 100 characters",
  })
  firstName!: string;

  @IsString({ message: "Please input a valid last name" })
  @Length(2, 100, {
    message: "First name must be between 2 and 100 characters",
  })
  lastName!: string;

  @Length(2, 100, {
    message: "password must be between 2 and 100 characters",
  })
  password!: string;

  @IsDate({ message: "Please input a valid date of birth" })
  @Type(() => Date)
  dob!: Date;

  @IsUrl({}, { message: "Please input a valid profile picture URL" })
  profilePicture!: string;

  @IsOptional()
  @IsArray({ message: "Please input a valid array of authored books" })
  @ValidateNested()
  authoredBooks?: AuthorBookRequestDto[];
}
