import express from "express";
import { RequestWithUser } from "../middlewares/checkUser";
import { Media } from "../entities/Media";
import { validate } from "class-validator";
import sharp, { FitEnum } from "sharp";
import fs from "fs";
import { transformImage } from "../utils/transformImage";

const uploadPath = process.env.UPLOADS_PATH || "./uploads";
// create upload folder if it doesn't exist
fs.mkdirSync(uploadPath, { recursive: true });

export async function createMedia(
  baseRequest: express.Request,
  res: express.Response,
) {
  if (baseRequest.file?.buffer) {
    const req = baseRequest as RequestWithUser;
    const newMedia = new Media();

    const filename = Date.now() + ".webp";
    const path = `${uploadPath}/${filename}`;

    await sharp(req.file?.buffer)
      .resize({ width: 3840, height: 2060, fit: "inside" })
      .toFile(path);

    newMedia.path = path;
    newMedia.mimetype = "image/webp";
    newMedia.originalName = req.file?.filename || "unknown";
    newMedia.createdBy = req.user;

    const errors = await validate(newMedia);
    if (errors.length === 0) {
      await newMedia.save();
      res.status(201).json(newMedia);
    } else {
      res.status(400).json(errors);
    }
  } else {
    res.status(400).json([{ message: "missing file" }]);
  }
}

export async function deleteMedia(
  baseRequest: express.Request,
  res: express.Response,
) {
  const req = baseRequest as RequestWithUser;
  const fileId = req.params.id;
  const media = await Media.findOne({
    where: { id: Number(fileId) },
    relations: { createdBy: true },
  });

  if (!media) {
    return res.status(404).json({ message: "Media not found" });
  }

  if (media?.createdBy.id !== req.user.id) {
    return res
      .status(403)
      .json({ message: "You are not allowed to delete this media" });
  }

  await media.remove();

  res.status(204).send();
}

export async function getMedia(
  baseRequest: express.Request,
  res: express.Response,
) {
  const req = baseRequest as RequestWithUser;
  const fileId = req.params.id;
  const media = await Media.findOneBy({ id: Number(fileId) });

  if (!media) {
    return res.status(404).json({ message: "Media not found" });
  }

  const width = req.query.width ? Number(req.query.width) : undefined;
  const height = req.query.height ? Number(req.query.height) : undefined;
  const fit = ["contain", "cover", "fill", "inside", "outside"].includes(
    req.query.fit as string,
  )
    ? (req.query.fit as keyof FitEnum)
    : undefined;

  const args = {
    path: media.path,
    width,
    height,
    fit,
  };

  return res.sendFile(await transformImage(args), { root: process.cwd() });
}
