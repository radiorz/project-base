import { join } from 'node:path';
import { workspace } from '../../version/lib/utils';
export interface ObfuscateOptions {}

/**
 * @author
 * @file Obfuscator.ts
 * @fileBase Obfuscator
 * @path tools\build-tools\lib\Obfuscator.ts
 * @from
 * @desc
 * @example
 */

export interface ObfuscatorOptions {
  include: string[];
  exclude: string[];
  outDir: string;
}

export class Obfuscator {
  static defaultOptions: ObfuscatorOptions = {
    include: ['**/*.js'],
    exclude: [],
    outDir: join(process.cwd(), 'dist'),
  };
  options: ObfuscatorOptions;
  constructor(options?: Partial<ObfuscatorOptions>) {
    this.options = Object.assign({}, Obfuscator.defaultOptions, options);
  }
  start() {}
}
