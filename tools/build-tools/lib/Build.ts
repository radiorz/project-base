/**
 * @author
 * @file Build.ts
 * @fileBase Build
 * @path scripts\build-tools\lib\Build.ts
 * @from
 * @desc
 * @todo
 *
 *
 * @done
 * @example
 */
import { Logger } from '@tikkhun/logger';
import { readFile, writeFile } from 'node:fs/promises';
import { obfuscate } from 'javascript-obfuscator';
import path from 'path';
import { glob } from 'glob';
import { ensureFile } from 'fs-extra';
import { merge } from 'lodash';
const workspace = process.cwd();
const logger = new Logger('Build');
export interface ObfuscateOptions {
  include: string[];
  exclude: string[];
}
export interface BytenodeOptions {
  include: string[];
  exclude: string[];
}
export interface Options {
  workspace: string;
  outDir: string;
  obfuscate: boolean;
  obfuscateOptions: ObfuscateOptions;
}
export const DEFAULT_BUILD_OPTIONS: Options = {
  workspace: process.cwd(),
  outDir: 'dist',
  obfuscate: true,
  obfuscateOptions: {
    include: ['src/**.js'],
    exclude: [],
  },
};
export class Build {
  options: Options;
  constructor(options?: Partial<Options>) {
    this.options = merge(DEFAULT_BUILD_OPTIONS, options);
  }
  get outDir() {
    return path.join(workspace, this.options.outDir);
  }
  // watchError() {
  //   process.on()
  // }
  async start() {
    logger.log('start');
    if (this.options.obfuscate) {
      const { include, exclude } = this.options.obfuscateOptions;
      const files = await glob(include, { ignore: exclude });
      for (const file of files) {
        const result = obfuscate((await readFile(file)).toString());
        const outputFile = path.join(this.outDir, file);
        await ensureFile(outputFile);
        // 保存：
        await writeFile(outputFile, result.getObfuscatedCode());
        logger.debug!(outputFile);
      }
    }
  }
  stop() {}
  clean() {}
}
