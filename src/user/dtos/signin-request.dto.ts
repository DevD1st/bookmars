import { Length } from "class-validator";
import { IsEmail } from "class-validator";

export class SigninRequestDto {
  @IsEmail({}, { message: "Please input a valid email." })
  email!: string;

  @Length(2, 100, {
    message: "password must be between 2 and 100 characters",
  })
  password!: string;
}
