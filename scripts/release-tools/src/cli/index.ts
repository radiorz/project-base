import { program } from "commander";
program
  .option("--b --buildOption")
  .option("-d --deployOption") // 有可能有多个应用
  .option("-r --releaseOption");
