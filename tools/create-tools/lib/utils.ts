// utils/paths.js

import { existsSync } from 'fs';

import { glob } from 'glob';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { findNodeLibRootDir } from '@tikkhun/utils'

let currentDirname;
if (typeof __dirname === 'undefined') {
  // ES 模块环境
  currentDirname = dirname(fileURLToPath(import.meta.url)); // esmodule 这么用
} else {
  currentDirname = __dirname;
}
export const rootDir = findNodeLibRootDir(currentDirname);
export const templatesDir = join(rootDir, 'templates');

// 获取 templates
export async function getTemplates(templatesDir: string) {
  // 读取本目录下的template清单
  const results = await glob('*', {
    cwd: templatesDir,
  });
  // console.log(`results`,results)
  return results;
}
