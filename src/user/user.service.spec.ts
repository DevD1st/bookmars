import { Profile } from "../profile/profile.entity";
import { JwtPayload } from "../util";
import { CreateUserRequestDto } from "./dtos/create-user-request.dto";
import { User } from "./user.entity";
import { userService } from "./user.service";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { SigninRequestDto } from "./dtos/signin-request.dto";

describe("UserService", () => {
  const id = 1;
  const email = "test@test.com";
  const password = "password";
  const profilePicture = "https://example.com/example.png";
  const firstName = "firstName";
  const lastName = "lastName";

  describe("signup", () => {
    describe("Given valid request body", () => {
      it("should create a new user", async () => {
        const dto = new CreateUserRequestDto();
        dto.email = email;
        dto.password = password;
        dto.dob = new Date();
        dto.profilePicture = profilePicture;
        dto.firstName = firstName;
        dto.lastName = lastName;

        const profile = new Profile();
        profile.dob = dto.dob;
        profile.id = id;
        profile.profilePicture = profilePicture;

        const savedUser = {
          id,
          firstName,
          lastName,
          email,
          password,
          isActive: true,
          profile,
          auth: [],
        } as any;

        jest.spyOn(User.prototype, "save").mockResolvedValueOnce({
          ...savedUser,
          save: jest.fn().mockResolvedValueOnce(savedUser),
        });

        jest.spyOn(jwt, "verify").mockImplementationOnce(
          () =>
            ({
              id,
              email,
            } as JwtPayload)
        );

        jest.spyOn(jwt, "sign").mockImplementationOnce(() => "signed");

        const { statusCode, message, data } = await userService.signup(dto);

        expect(statusCode).toBe(201);
        expect(message).toContain("success");
        expect(data).not.toBeNull();
      });
    });
  });

  describe("signin", () => {
    describe("given valid request body", () => {
      it("should sign in the user", async () => {
        const dto = new SigninRequestDto();
        dto.email = email;
        dto.password = password;

        const profile = new Profile();
        profile.dob = new Date();
        profile.id = id;
        profile.profilePicture = profilePicture;

        const savedUser = {
          id,
          firstName,
          lastName,
          email,
          password,
          isActive: true,
          profile,
          auth: [],
        } as any;

        jest.spyOn(User, "createQueryBuilder").mockReturnValueOnce({
          where: jest.fn().mockReturnThis(),
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValueOnce({
            ...savedUser,
            save: jest.fn().mockResolvedValueOnce({ ...savedUser }),
          }),
        } as any);

        jest.spyOn(jwt, "verify").mockImplementationOnce(
          () =>
            ({
              id,
              email,
            } as JwtPayload)
        );
        jest.spyOn(jwt, "sign").mockImplementationOnce(() => "signed");

        jest.spyOn(bcrypt, "compare").mockImplementationOnce(() => true);

        const res = await userService.signin(dto);

        expect(res.statusCode).toBe(200);
        expect(res.message).toContain("success");
        expect(res.data).toBeDefined();
      });
    });
  });

  describe("fetchUser", () => {
    describe("given valid email address", () => {
      it("successfully return user", async () => {
        jest.spyOn(User, "createQueryBuilder").mockReturnValueOnce({
          where: jest.fn().mockReturnThis(),
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValueOnce({
            id,
            firstName,
            lastName,
            email,
            password,
            isActive: true,
          }),
        } as any);

        const res = await userService.fetchUser({ email, id });

        expect(res.statusCode).toBe(200);
        expect(res.data).toBeDefined();
      });
    });
  });
});
