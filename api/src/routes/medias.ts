import express from "express";
import { createMedia, deleteMedia, getMedia } from "../controllers/medias";
import { checkUser } from "../middlewares/checkUser";
import multer from "multer";

export const mediasRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

mediasRouter.post("/", checkUser, upload.single("image"), createMedia); // create quiz
mediasRouter.get("/:id", checkUser, getMedia); // read quiz
mediasRouter.delete("/:id", checkUser, deleteMedia); // delete quiz
