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
export interface ObfuscateOptions {}
export interface BytenodeOptions {}
export interface Options {
  obfuscate: true;
  obfuscateOptions: ObfuscateOptions;
  bytenode: true;
  bytenodeOptions: BytenodeOptions;
}
export const DEFAULT_OPTIONS: Options = {
  obfuscate: true,
  obfuscateOptions: {},
  bytenode: true,
  bytenodeOptions: {},
};
export class Build {
  options: Options;
  constructor(options?: Partial<Options>) {
    this.options = Object.assign(DEFAULT_OPTIONS, options);
  }
}
