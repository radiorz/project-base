import { program } from "commander";
import { changeVersion } from "./version";
program
  .command("version")
  .description("更新版本号")
  .option("-p,--packageJsonPath", "package.json path", "./package.json")
  .option("-s --strategy", "version update strategy", "AutoIncrement")
  .action((options) => {
    console.log(`options`, options);
    // console.log(`hello`, changeVersion(options));
  });
