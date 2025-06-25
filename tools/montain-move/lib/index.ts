import { glob } from 'glob';
import { mergeOptions } from '@tikkhun/utils-core';
import path from 'path';
import fs from 'fs';
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
  console.log(`includes`,includes)
  const dirs = await glob(includes, { ignore: opts.exclude, cwd: opts.cwd });
  logger.info(`需要移动文件夹数量为 ${dirs.length}`);
  // 移动到target
  for (const dir of dirs) {
    try {
      const target = path.join(opts.target, dir);
      await fs.promises.mkdir(path.dirname(target), { recursive: true });
      await fs.promises.rename(path.join(opts.cwd, dir), target);
      logger.info(`移动${dir}到${target}`);
    } catch (error) {
      logger.error(`移动${dir}到${opts.target}失败`, error);
    }
  }
}
