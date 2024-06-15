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

export interface Options {
  obfuscate: true;
  obfuscateOptions: ObfuscateOptions;
  bytenode: true;
  bytenodeOptions: 
}
export const DEFAULT_OPTIONS = {};
export class Build {
  options: Options;
  constructor(options?: Partial<Options>) {
    this.options = Object.assign(DEFAULT_OPTIONS, options);
  }
}
