import express from "express";
import { User, UserInput } from "../entities/User";
import { createHash } from "crypto";
import { sign } from "jsonwebtoken";
import Cookies from "cookies";
import { validate } from "class-validator";

export async function createUser(req: express.Request, res: express.Response) {
  const input = new UserInput(req.body);
  const inputErrors = await validate(input);
  if (inputErrors.length > 0) {
    res.status(400).json(inputErrors);
  }

  const entity = new User();
  Object.assign(entity, req.body);

  const hashedPassword = createHash("sha256")
    .update(entity.password)
    .digest("hex");
  entity.password = hashedPassword;

  const entityErrors = await validate(entity);
  if (entityErrors.length === 0) {
    await entity.save();
    res.status(201).json({ ...entity, password: undefined });
  } else {
    res.status(400).json(entityErrors);
  }
}

export async function createToken(req: express.Request, res: express.Response) {
  const existingUser = await User.findOneBy({ email: req.body.email });

  if (!existingUser) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const hashedPassword = createHash("sha256")
    .update(req.body.password)
    .digest("hex");

  if (hashedPassword !== existingUser.password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = sign(
    { userId: existingUser.id },
    process.env.JWT_SECRET || "supersecret",
    {
      expiresIn: "1d",
    },
  );

  const cookies = new Cookies(req, res);
  cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(200).json({
    token,
  });
}

export async function deleteToken(req: express.Request, res: express.Response) {
  const cookies = new Cookies(req, res);
  cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
  res.status(204).send();
}
