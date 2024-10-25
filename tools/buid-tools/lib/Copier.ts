import { isFile } from '@tikkhun/utils';
import { optionsMerge } from '@tikkhun/utils-core';
import { glob } from 'glob';
import { mkdir, copyFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
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
    const allPaths = await glob(this.options.include, {
      ignore: [...this.options.exclude, this.options.outDir],
      dot: true,
    });

    await Promise.all(
      allPaths.map(async (src) => {
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
  }
}
