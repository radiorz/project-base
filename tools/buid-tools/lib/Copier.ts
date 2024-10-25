import { isFile } from '@tikkhun/utils';
import { optionsMerge } from '@tikkhun/utils-core';
import { glob } from 'glob';
import { mkdir, copyFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { Logger } from '@tikkhun/logger';
/**
 * @author
 * @file Copyer.ts
 * @fileBase Copyer
 * @path tools\build-tools\lib\Copyer.ts
 * @from
 * @desc
 * @example
 */

export interface CopierOptions {
  include: string[];
  exclude: string[];
  outDir: string;
}

export class Copier {
  log = new Logger('Copier');
  static defaultOptions: CopierOptions = {
    include: ['**/*'],
    exclude: ['**/node_modules', '**/release'],
    outDir: 'dist',
  };
  options: CopierOptions;
  constructor(options?: Partial<CopierOptions>) {
    this.options = optionsMerge(Copier.defaultOptions, options);
  }
  async start() {
    this.log.log('[开始] 拷贝');
    const srcPaths = await glob(this.options.include, {
      ignore: [...this.options.exclude, this.options.outDir],
      dot: true,
    });

    const results = await Promise.all(
      srcPaths.map(async (src) => {
        const isFileNotDirectory = await isFile(src);
        if (!isFileNotDirectory) {
          // directory
          return await mkdir(join(this.options.outDir, src), { recursive: true });
        }
        const destFile = join(this.options.outDir, src);
        const destDir = dirname(destFile);
        await mkdir(destDir, { recursive: true });
        return await copyFile(src, destFile);
      }),
    );
    this.log.log('[完成] 拷贝');
    return results;
  }
}
