import { createHash } from "crypto";
import fs from "fs";
import sharp, { FitEnum } from "sharp";

const cachePath = process.env.CACHE_PATH || "./cache";
// create upload folder if it doesn't exist
fs.mkdirSync(cachePath, { recursive: true });

export async function transformImage(args: {
  width?: number;
  height?: number;
  fit?: keyof FitEnum;
  path: string;
}) {
  if (!args.width && !args.height && !args.fit) {
    return args.path;
  } else {
    const key = createHash("sha256").update(JSON.stringify(args)).digest("hex");
    const imageCachePath = `${cachePath}/${key}.webp`;
    if (fs.existsSync(`${cachePath}/${key}`)) {
      return imageCachePath;
    } else {
      await sharp(args.path)
        .resize({ width: args.width, height: args.height, fit: args.fit })
        .toFile(imageCachePath);
      return imageCachePath;
    }
  }
}
