import express from "express";
import { createServer } from "http";
import { usersRouter } from "./routes/users";
import { AppDataSource } from "./datasource";
import { quizzesRouter } from "./routes/quizzes";
import { mediasRouter } from "./routes/medias";

const port = process.env.PORT || 3000;

async function main() {
  await AppDataSource.initialize();

  const app = express();

  app.get("/", (req, res) => {
    res.send("Hello Jim!");
  });

  app.use(express.json());
  app.use("/api/users", usersRouter);
  app.use("/api/quizzes", quizzesRouter);
  app.use("/api/medias", mediasRouter);

  app.use((req, res) => {
    res.status(404).json({ message: "not found" });
  });

  const server = createServer(app);

  server.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`);
  });
}

main();
