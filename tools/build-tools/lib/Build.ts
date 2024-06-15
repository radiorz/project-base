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
const logger = new Logger('Build');
export interface ObfuscateOptions {}
// export interface BytenodeOptions {}
export interface Options {
  workspace: string;
  outDir: string;
  obfuscate: boolean;
}
export const DEFAULT_OPTIONS: Options = {
  workspace: process.cwd(),
  outDir: 'dist',
  obfuscate: true,
};
export class Build {
  options: Options;
  constructor(options?: Partial<Options>) {
    this.options = Object.assign(DEFAULT_OPTIONS, options);
  }
  // watchError() {
  //   process.on()
  // }
  start() {
    logger.log('hello');
  }
  stop() {}
  clean() {}
}
