import { Logger } from '@tikkhun/logger';
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
  const flatFiles = files.reduce((acc, files) => [...acc, ...files], []);
  await Promise.all(
    flatFiles.map(async (file) => {
      const sourceFilePath = join(sourcePath, file);
      if (!(await isFile(sourceFilePath))) {
        return;
      }
      logger.log(`sourceFilePath` + sourceFilePath);
      const targetFilePath = join(targetPath, basename(file));
      logger.log(`targetFilePath` + targetFilePath);
      await rename(sourceFilePath, targetFilePath);
    }),
  );
  logger.log('结束');
}

async function isFile(path: string) {
  const stats = await stat(path);
  return stats.isFile() && !stats.isDirectory();
}
