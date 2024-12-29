import { instanceToPlain, plainToInstance } from "class-transformer";
import { CreateUserRequestDto } from "./dtos/create-user-request.dto";
import { User } from "./user.entity";
import { Profile } from "../profile/profile.entity";
import { Auth } from "../auth/auth.entity";
import { Book } from "../book/book.entity";
import { generateToken } from "../util";
import * as bcrypt from "bcrypt";
import { ResponseDto } from "../dtos/response.dto";
import { SigninRequestDto } from "./dtos/signin-request.dto";

class UserService {
  constructor() {}

  async signup(dto: CreateUserRequestDto) {
    try {
      const user = plainToInstance(User, dto, {
        excludePrefixes: ["password"],
      });
      user.isActive = true;
      user.profile = plainToInstance(Profile, {
        dob: dto.dob,
        profilePicture: dto.profilePicture,
      });
      user._password = await bcrypt.hash(dto.password, 12);
      user.auth = [
        plainToInstance(Auth, { token: generateToken({ email: dto.email }) }),
      ];
      user.authoredBooks = dto.authoredBooks?.map((book) =>
        plainToInstance(Book, book)
      )!;

      const savedUser = await user.save();

      return new ResponseDto(
        201,
        "User created successfullly.",
        instanceToPlain(savedUser, { excludePrefixes: ["_"] })
      );
    } catch (error: any) {
      console.error(error);

      return new ResponseDto(
        error.statusCode || 400,
        error.message || "Error occurred."
      );
    }
  }

  async signin(dto: SigninRequestDto) {
    try {
      const user = await User.findOneBy({ email: dto.email });
      if (!user)
        throw new ResponseDto(400, "Email address or password incorrect.");

      const isPasswordCorrect = await bcrypt.compare(
        dto.password,
        user._password
      );
      if (!isPasswordCorrect)
        throw new ResponseDto(400, "Email address or password incorrect.");

      return new ResponseDto(
        200,
        "Signin successful.",
        instanceToPlain(user, { excludePrefixes: ["_"] })
      );
    } catch (error: any) {
      console.error(error);

      return new ResponseDto(
        error.statusCode || 400,
        error.message || "Error occurred."
      );
    }
  }
}

export const userService = new UserService();
