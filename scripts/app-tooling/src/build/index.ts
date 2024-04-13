import { STRATEGY } from "./types";
const buildOptions = {
  include: ["**/*"],
  includeDot: true, // 是否包含dot
  exclude: [
    "**/data/**",
    // '**/node_modules/**',
    "**/release/**",
    `**/deploy/**`,
    "**/docs/**",
    "**/terminals/!(一键报警)/**/*",
    "**/.git/**",
    "**/.history/**",
    "**/.idea/**",
    "**/.vscode/**",
    // '**/.env**',
  ],
  compileOptions: [
    {
      type: STRATEGY.OBFUSCATE,
      include: [],
      exclude: [],
      tempPath: "", // 临时路径(一般不指定)
    },
    {
      type: STRATEGY.BYTENODE,
      include: [],
      exclude: [], // ignore
      tempPath: "", // 临时路径(一般不指定)
    },
  ],
  outputDir: "",
};
