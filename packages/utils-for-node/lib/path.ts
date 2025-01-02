import { existsSync } from 'fs';
import { dirname, join } from 'path';
// 执行的根路径
export const rootDir = process.cwd();
// 执行的packageJson
export const packageJsonPath = join(rootDir, 'package.json');
// 执行的根路径下的data目录
export const dataDir = join(rootDir, 'data');
// 执行的根路径下的src目录
export const srcDir = join(rootDir, 'src');
export class PathResolver {
  root(dir: string) {
    return join(rootDir, dir);
  }
  data(dir: string) {
    return join(dataDir, dir);
  }
  src(dir: string) {
    return join(srcDir, dir);
  }
}

/**
 * 获取指定文件夹的根路径
 * @param startDir 起始位置
 * @returns
 */
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
