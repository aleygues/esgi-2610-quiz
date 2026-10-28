import express from "express";
import { createQuiz } from "../controllers/quizzes";
import { checkUser } from "../middlewares/checkUser";

export const quizzesRouter = express.Router();

quizzesRouter.post("/", checkUser, createQuiz); // create quiz
