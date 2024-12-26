import { DataSource } from "typeorm";

export const dataSource = new DataSource({
  type: "postgres",
  cache: true,
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "bookmars",
  entities: ["dist/**/*.entity.js"],
  synchronize: process.env.NODE_ENV !== "production",
  logging: ["error", "warn"],
});
