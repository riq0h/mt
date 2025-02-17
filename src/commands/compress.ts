import * as fs from "fs";
import { archiveFile, archiveFolder } from "zip-lib";

export interface CompressOperation {
  itemPath: string;
  zipPath: string;
  isFile: boolean;
}

export async function compressFiles(targets?: string[]): Promise<void> {
  try {
    const currentDir = process.cwd();
    let isCompressed = false;

    const itemsToCompress =
      !targets || targets.length === 0
        ? fs
            .readdirSync(currentDir)
            .filter((item) => !item.startsWith(".") && !item.endsWith(".zip"))
        : targets;

    const operations: CompressOperation[] = itemsToCompress.map((item) => ({
      itemPath: item,
      zipPath: `${item}.zip`,
      isFile: fs.existsSync(item) ? fs.statSync(item).isFile() : false,
    }));

    for (const op of operations) {
      if (fs.existsSync(op.zipPath)) {
        throw new Error(
          `${op.zipPath} already exists. compression was not performed.`,
        );
      }
    }

    for (const op of operations) {
      if (!fs.existsSync(op.itemPath)) {
        throw new Error(
          `${op.itemPath} was not found. compression was not performed.`,
        );
      }
      await compressItem(op);
      isCompressed = true;
    }

    if (isCompressed) {
      console.log("compression completed.");
    } else {
      console.log(
        "no files to compress were found. compression was not performed.",
      );
    }
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

async function compressItem(operation: CompressOperation): Promise<void> {
  if (operation.isFile) {
    await archiveFile(operation.itemPath, operation.zipPath);
  } else {
    await archiveFolder(operation.itemPath, operation.zipPath);
  }
}
