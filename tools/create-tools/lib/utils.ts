// utils/paths.js

import { existsSync } from 'fs';

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

export function findRootDir(startDir: string) {
  // 我们假设项目根目录下有一个 package.json 文件
  let dir = startDir;
  while (!existsSync(join(dir, 'package.json'))) {
    dir = dirname(dir);
    if (dir === dirname(dir)) {
      // 已经到达文件系统的根目录
      throw new Error('Could not find project root directory');
    }
  }
  return dir;
}
let currentDirname;
if (typeof __dirname === 'undefined') {
  // ES 模块环境
  currentDirname = dirname(fileURLToPath(import.meta.url)); // esmodule 这么用
} else {
  currentDirname = __dirname;
}
export const rootDir = findRootDir(currentDirname);
export const templatesDir = join(rootDir, 'templates');
