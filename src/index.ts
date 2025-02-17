#!/usr/bin/env node
import { Command } from "commander";
import { version, description } from "../package.json";
import { renameFiles, compressFiles, resizeImages } from "./lib";

interface Options {
  rename?: boolean;
  compress?: boolean | string[];
  image?: string[];
  percentage?: number;
}

const program = new Command();

program.version(version).description(description);

program
  .option("-r, --rename", "rename files in bulk. $EDITOR will be launched")
  .option(
    "-c, --compress [targets...]",
    "compress files individually. If no file name is specified, all files in the directory will be targeted",
  )
  .option(
    "-i, --image <files...>",
    "resize image files. File name and -p option are required",
  )
  .option("-p, --percentage <value>", "specify the resize percentage")
  .action((options: Options) => {
    try {
      if (options.rename) {
        renameFiles();
      } else if (options.compress) {
        compressFiles(options.compress === true ? undefined : options.compress);
      } else if (options.image) {
        if (!options.percentage) {
          throw new Error(
            "resize percentage must be specified with the -p option for image resizing.",
          );
        }
        resizeImages(options.image, options.percentage);
      } else {
        program.help();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("error:", error.message);
        process.exit(1);
      }
    }
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.help();
}
