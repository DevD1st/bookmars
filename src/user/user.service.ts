import { instanceToPlain, plainToInstance } from "class-transformer";
import { CreateUserRequestDto } from "./dtos/create-user-request.dto";
import { User } from "./user.entity";
import { Profile } from "../profile/profile.entity";
import { Auth } from "../auth/auth.entity";
import { Book } from "../book/book.entity";
import { generateToken, JwtPayload } from "../util";
import * as bcrypt from "bcrypt";
import { ResponseDto } from "../dtos/response.dto";
import { SigninRequestDto } from "./dtos/signin-request.dto";

class UserService {
  async signup(dto: CreateUserRequestDto) {
    const user = plainToInstance(User, dto, {
      excludePrefixes: ["password"],
    });
    user.isActive = true;
    user.profile = plainToInstance(Profile, {
      dob: dto.dob,
      profilePicture: dto.profilePicture,
    });
    user._password = await bcrypt.hash(dto.password, 12);
    user.authoredBooks = dto.authoredBooks?.map((book) =>
      plainToInstance(Book, book)
    )!;
    const savedUser = await user.save();

    savedUser.auth = [
      plainToInstance(Auth, {
        token: generateToken({ email: dto.email, id: savedUser.id }),
      }),
    ];
    const savedUserWithAuth = await savedUser.save();

    return new ResponseDto(
      201,
      "User created successfullly.",
      instanceToPlain(savedUserWithAuth, { excludePrefixes: ["_"] })
    );
  }

  async signin(dto: SigninRequestDto) {
    // const user = await User.findOneBy({ email: dto.email });
    const user = await User.createQueryBuilder("user")
      .where({ email: dto.email })
      .leftJoinAndSelect("user.auth", "auth")
      .getOne();

    if (!user)
      throw new ResponseDto(400, "Email address or password incorrect.");

    const isPasswordCorrect = await bcrypt.compare(
      dto.password,
      user._password
    );
    if (!isPasswordCorrect)
      throw new ResponseDto(400, "Email address or password incorrect.");

    const token = generateToken({ email: dto.email, id: user.id });
    user.auth.push(plainToInstance(Auth, { token }));

    const savedUser = await user.save();
    return new ResponseDto(200, "Signin successful.", {
      user: instanceToPlain(savedUser, {
        excludePrefixes: ["_", "auth"],
      }),
      token: savedUser.auth.at(-1),
    });
  }

  async fetchUser({ email }: JwtPayload, populate?: string) {
    const toPopulate = populate?.split(",");

    const userQB = User.createQueryBuilder("user").where({ email });

    toPopulate?.map((toPopulateStr) =>
      userQB.leftJoinAndSelect(`user.${toPopulateStr}`, toPopulateStr)
    );

    const user = await userQB.getOne();
    return new ResponseDto(
      200,
      "User data fetched.",
      instanceToPlain(user, { excludePrefixes: ["_"] })
    );
  }
}

export const userService = new UserService();
