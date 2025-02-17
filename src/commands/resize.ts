import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";

export interface ResizeOperation {
  files: string[];
  percentage: number;
}

export async function resizeImages(
  files: string[],
  percentage: number,
): Promise<void> {
  try {
    if (!files || files.length === 0) {
      throw new Error("no image files specified.");
    }

    if (percentage <= 0 || percentage > 100) {
      throw new Error("resize percentage should be between 1 and 100.");
    }

    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const validFiles = files.filter((file: string) =>
      imageExtensions.includes(path.extname(file).toLowerCase()),
    );

    if (validFiles.length === 0) {
      throw new Error(
        "no valid image files found in the specified files. resizing was not performed.",
      );
    }

    for (const file of validFiles) {
      if (!fs.existsSync(file)) {
        throw new Error(`${file} not found. resizing was not performed.`);
      }

      const image = sharp(file);
      const metadata = await image.metadata();

      if (!metadata.width || !metadata.height) {
        throw new Error(
          `unable to get image size for ${file}. resizing was not performed.`,
        );
      }

      const newWidth = Math.round((metadata.width * percentage) / 100);
      const newHeight = Math.round((metadata.height * percentage) / 100);

      let outputPath = path.join(
        path.dirname(file),
        `${path.basename(file, path.extname(file))}_resized${path.extname(file)}`,
      );

      let counter = 2;
      while (fs.existsSync(outputPath)) {
        outputPath = path.join(
          path.dirname(file),
          `${path.basename(file, path.extname(file))}_resized_${counter}${path.extname(file)}`,
        );
        counter++;
      }

      await image.resize(newWidth, newHeight).toFile(outputPath);
    }

    console.log("image resizing completed.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("error:", error.message);
      process.exit(1);
    } else {
      console.error("unknown error.");
      process.exit(1);
    }
  }
}
