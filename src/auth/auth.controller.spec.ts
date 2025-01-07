import supertest from "supertest";
import createServer from "../server";
import { dataSource } from "../datasource";

const app = createServer();

function generateUniqueEmail() {
  const randomNumSuf = Math.floor(Math.random() * 10000);
  const randomNumPre = Math.floor(Math.random() * 10000);
  return `${randomNumPre}test${randomNumSuf}@example.com`;
}

beforeAll(() => {
  dataSource.initialize().then(() => {
    console.log("Server is running");
  });
});

describe("AuthController", () => {
  describe("/signup", () => {
    describe("given valid request body", () => {
      it("should create a new user", async () => {
        const res = await supertest(app)
          .post("/auth/signup")
          .accept("application/json")
          .send({
            email: generateUniqueEmail(),
            firstName: "Test",
            lastName: "User",
            password: "password",
            dob: "1990-01-01",
            profilePicture: "https://www.example.com/image.jpeg",
          });

        expect(res.status).toBe(201);
        expect(res.body).toBeDefined();
        expect(res.body.message).toContain("success");
      });
    });
  });
});
