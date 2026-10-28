import express from "express";
import { RequestWithUser } from "../middlewares/checkUser";
import { Quiz } from "../entities/Quiz";
import { validate } from "class-validator";

export async function createQuiz(
  baseRequest: express.Request,
  res: express.Response,
) {
  const req = baseRequest as RequestWithUser;
  const newQuiz = new Quiz();
  Object.assign(newQuiz, req.body);
  newQuiz.createdBy = req.user;

  const errors = await validate(newQuiz);
  if (errors.length === 0) {
    await newQuiz.save();
    res.status(201).json(newQuiz);
  } else {
    res.status(400).json(errors);
  }
}
