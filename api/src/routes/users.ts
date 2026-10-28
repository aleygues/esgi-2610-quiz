import express from "express";
import { createToken, createUser, deleteToken } from "../controllers/users";

export const usersRouter = express.Router();

usersRouter.post("/", createUser); // POST /api/users → signup
usersRouter.post("/tokens", createToken); // POST /api/users/tokens → signin
usersRouter.delete("/tokens", deleteToken); // DELETE /api/users/tokens → signout
