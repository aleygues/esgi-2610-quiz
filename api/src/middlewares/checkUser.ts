import express from "express";
import { User } from "../entities/User";
import { getUserFromRequest } from "../utils/getUserFromRequest";

export interface RequestWithUser extends express.Request {
  user: User;
}

export async function checkUser(
  baseRequest: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const req = baseRequest as RequestWithUser;
  const user = await getUserFromRequest(req, res);

  if (user) {
    req.user = user;
    next();
  } else {
    return res.status(403).json({ message: "access denied" });
  }
}
