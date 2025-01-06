import { Profile } from "../profile/profile.entity";
import { JwtPayload } from "../util";
import { CreateUserRequestDto } from "./dtos/create-user-request.dto";
import { User } from "./user.entity";
import { userService } from "./user.service";
import jwt from "jsonwebtoken";

describe("UserService", () => {
  describe("signup", () => {
    describe("Given valid request body", () => {
      const id = 1;
      const email = "test@test.com";
      const password = "password";
      const profilePicture = "https://example.com/example.png";
      const firstName = "firstName";
      const lastName = "lastName";

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

        jest.spyOn(jwt, "verify").mockImplementation(
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
});
