import { DataSource } from "typeorm";

export const dataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  cache: true,
  host: process.env.HOST,
  port: +process.env.DB_PORT!,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ["dist/**/*.entity.js"],
  synchronize: process.env.NODE_ENV !== "production",
  logging: ["error", "warn"],
});
