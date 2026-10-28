import { mkdirSync } from "fs";
import { dirname } from "path";
import { DataSource } from "typeorm";

const database = process.env.DB_PATH || "./data/quiz.db";
mkdirSync(dirname(database), { recursive: true });

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database,
  synchronize: true,
  logging: true,
  entities: ["src/entities/**/*.{ts,js}"],
});
