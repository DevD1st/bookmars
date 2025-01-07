import "reflect-metadata";
import { dataSource } from "./datasource";
import createServer from "./server";

const app = createServer();

dataSource.initialize().then(() => {
  app.listen(process.env.PORT);
  console.log("Server is running");
});
