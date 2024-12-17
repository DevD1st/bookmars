import express from "express";
import authController from "./auth/auth.controller";
import userController from "./user/user.controller";
import profileController from "./profile/profile.controller";
import bookController from "./book/book.controller";

const app = express();

app.get("/", (_, res) => {
  res.send("Hello World");
});

app.use("/auth", authController);
app.use("/user", userController);
app.use("/profile", profileController);
app.use("/book", bookController);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
