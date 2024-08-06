import { Logger } from '@tikkhun/logger';
import { existsSync } from 'fs';
import { rename, stat } from 'fs/promises';
import { glob } from 'glob';
import { join, basename } from 'path';
export interface FlatDirOptions {
  sourcePath: string;
  includes: string[];
  excludes: string[];
  targetPath: string;
}

export const DEFAULT_FLAT_DIR_OPTIONS: FlatDirOptions = {
  sourcePath: '',
  includes: ['**/*'],
  excludes: ['node_modules'],
  targetPath: '',
};

export async function flatDir(options: Partial<FlatDirOptions> = {}) {
  const logger = new Logger('平整文件');
  const { sourcePath, includes, excludes, targetPath }: FlatDirOptions = Object.assign(
    DEFAULT_FLAT_DIR_OPTIONS,
    options,
  );
  logger.log('开始' + JSON.stringify({ sourcePath, includes, excludes, targetPath }, null, 2));

  const files = await Promise.all(includes.map((pattern) => glob(pattern, { cwd: sourcePath, ignore: excludes })));
  const flatFiles = files.reduce((acc: string[], files: string[]) => [...acc, ...files], []);
  await Promise.all(
    flatFiles.map(async (file: string) => {
      try {
        const sourceFilePath = join(sourcePath, file);
        if (!(await isFile(sourceFilePath))) {
          return;
        }
        logger.log(`源头文件: ` + sourceFilePath);
        let targetFilePath = join(targetPath, basename(file));
        let i = 0;
        // TODO 检查是否已经有 如果有就重命名一下。
        while (isExists(targetFilePath)) {
          targetFilePath = join(targetPath, `副本${i}-${basename(file)}`);
          i++;
        }
        if (isExists(targetFilePath)) {
        }
        logger.log(`目标文件：` + targetFilePath);
        await rename(sourceFilePath, targetFilePath);
        logger.log(`[成功] 更改文件：${sourceFilePath} => ${targetFilePath}`);
      } catch (error) {
        logger.warn(`目标文件,但失败: ` + file);
      }
    }),
  );
  logger.log('结束');
}

async function isFile(path: string) {
  const stats = await stat(path);
  return stats.isFile() && !stats.isDirectory();
}
function isExists(path: string): boolean {
  return existsSync(path);
}
