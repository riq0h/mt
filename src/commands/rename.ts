import * as fs from "fs";
import * as path from "path";
import { openEditor } from "../utils/editor";

export interface RenameOperation {
  oldName: string;
  newName: string;
  path: string;
  newPath: string;
}

export async function renameFiles(): Promise<void> {
  try {
    const files = fs
      .readdirSync(process.cwd())
      .filter((file) => !file.startsWith("."));
    const fileContent = files.join("\n");
    const editedContent = await openEditor(fileContent);
    const newNames = editedContent.trim().split("\n");

    if (newNames.length !== files.length) {
      throw new Error(
        "the number of files and lines do not match. renaming was not performed.",
      );
    }

    const uniqueNames = new Set(newNames);
    if (uniqueNames.size !== newNames.length) {
      throw new Error("file names are duplicated. renaming was not performed.");
    }

    if (newNames.some((name) => /[\s　]/.test(name))) {
      throw new Error(
        "file names cannot contain whitespace characters. renaming was not performed.",
      );
    }

    newNames.forEach((name) => {
      if (name.includes("/") || name.includes("\\")) {
        throw new Error(
          "file names cannot contain paths. renaming was not performed.",
        );
      }
    });

    const operations = files.map((oldName, index) => ({
      oldName,
      newName: newNames[index],
      path: path.join(process.cwd(), oldName),
      newPath: path.join(process.cwd(), newNames[index]),
    }));

    if (!operations.some((op) => op.oldName !== op.newName)) {
      console.log("no changes were made. renaming was not performed.");
      return;
    }

    for (const op of operations) {
      if (op.oldName !== op.newName) {
        fs.renameSync(op.path, op.newPath);
      }
    }

    console.log("renaming completed successfully.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("error:", error.message);
    } else {
      console.log("unknown error.");
      process.exit(1);
    }
  }
}
