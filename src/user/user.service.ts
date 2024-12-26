import { instanceToPlain, plainToInstance } from "class-transformer";
import { CreateUserRequestDto } from "./dtos/create-user-request.dto";
import { User } from "./user.entity";
import { Profile } from "../profile/profile.entity";
import { Auth } from "../auth/auth.entity";
import { Book } from "../book/book.entity";
import { generateToken } from "../util";
import * as bcrypt from "bcrypt";
import { ResponseDto } from "../dtos/response.dto";

class UserService {
  constructor() {}

  async signup(dto: CreateUserRequestDto) {
    const user = plainToInstance(User, dto, { excludePrefixes: ["password"] });
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
  }
}

export const userService = new UserService();
