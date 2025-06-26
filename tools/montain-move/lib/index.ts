import { glob } from 'glob';
import { mergeOptions } from '@tikkhun/utils-core';
import path from 'path';
import fs, { existsSync, stat } from 'fs';
export const defaultMvOptions = {
  cwd: '.',
  includes: ['node_modules'],
  exclude: [],
  // recursive: true,
  target: '.trash',
};
const logger = console;
export type MvOptions = typeof defaultMvOptions;
export async function mv(options: Partial<MvOptions>) {
  const opts: MvOptions = mergeOptions(defaultMvOptions, options);
  const includes = opts.includes.map((_path) => `**/${_path}`);
  console.log(`includes`, includes);
  let dirs = await glob(includes, { ignore: opts.exclude, cwd: opts.cwd });
  // 如果是父亲则直接去父亲
  dirs = excludeSubPaths(dirs);
  console.log(`dirs`, dirs);
  logger.info(`需要移动文件夹数量为 ${dirs.length}`);

  // 移动到target
  for (const dir of dirs) {
    try {
      const dirPath = path.join(opts.cwd, dir);
      const isDirExist = existsSync(dirPath);
      if (!isDirExist) {
        throw new Error(`移动 ${dir} ${dir} 不存在`);
      }
      const target = path.join(opts.target, dir);
      logger.info(`移动 ${dir} 到 ${target}`);
      await fs.promises.mkdir(path.dirname(target), { recursive: true });
      await fs.promises.rename(dirPath, target);
    } catch (error) {
      logger.error(`移动 ${dir} 到 ${opts.target} 失败`, error);
    }
  }
}
/**
 * 排除已有父文件的子文件
 * @param paths - 文件路径数组
 * @returns 排除子文件后的路径数组
 */
function excludeSubPaths(paths: string[]): string[] {
  // 按路径长度排序，短路径在前，确保先处理父路径
  const sortedPaths = [...paths].sort((a, b) => a.length - b.length);
  const result: string[] = [];

  for (const path of sortedPaths) {
    // 检查当前路径是否为已有结果中某个路径的子路径
    const isSubPath = result.some((parentPath) => path.startsWith(parentPath));
    if (!isSubPath) {
      result.push(path);
    }
  }

  return result;
}
