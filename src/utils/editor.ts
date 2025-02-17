import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { spawn } from "child_process";

export function openEditor(content: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const editor: string = process.env.EDITOR || "vim";
    const tmpFile: string = path.join(
      os.tmpdir(),
      `mtt-rename-${Date.now()}.txt`,
    );
    fs.writeFileSync(tmpFile, content);
    const child = spawn(editor, [tmpFile], {
      stdio: "inherit",
    });

    child.on("exit", (code: number) => {
      if (code === 0) {
        const editedContent: string = fs.readFileSync(tmpFile, "utf8");
        fs.unlinkSync(tmpFile);
        resolve(editedContent);
      } else {
        fs.unlinkSync(tmpFile);
        reject(new Error(`editor exited with code ${code}`));
      }
    });

    child.on("error", (err: Error) => {
      fs.unlinkSync(tmpFile);
      reject(err);
    });
  });
}
