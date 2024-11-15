import * as dotenv from "dotenv";
import { DataSource } from "typeorm";
import path from "path";

if (process.env.NODE_ENV != "test") {
  dotenv.config();
}

if (process.env.NODE_ENV == "test") {
  dotenv.config({ path: path.resolve(__dirname, "../.env.test") });
}

const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME, NODE_ENV } = process.env;
export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: parseInt(String(DB_PORT)),
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  entities: [__dirname + "/**/*.entity{.ts,.js}"],
  synchronize: false,
  logging: NODE_ENV === "development" ? ["error","info","warn", "log"] : false,
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  subscribers: [],
  cache: true,
  ssl: NODE_ENV === "production"? { rejectUnauthorized: false } : false,
});
