import { Logger } from '@tikkhun/logger';
import { isFile } from '@tikkhun/utils';
import { glob } from 'glob';
import { obfuscate } from 'javascript-obfuscator';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
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
  log = new Logger('Obfuscator');
  static defaultOptions: ObfuscatorOptions = {
    include: ['**/*.js'],
    exclude: [],
    outDir: 'dist',
  };
  options: ObfuscatorOptions;
  constructor(options?: Partial<ObfuscatorOptions>) {
    this.options = Object.assign({}, Obfuscator.defaultOptions, options);
  }
  async start() {
    this.log.log('[开始] 混淆');
    const srcPaths = await glob(this.options.include, {
      ignore: [...this.options.exclude, this.options.outDir],
      dot: true,
    });
    const results = await Promise.all(
      srcPaths.map(async (src) => {
        const isFileNotDirectory = await isFile(src);
        if (!isFileNotDirectory) {
          return false;
        }
        const code = await readFile(src, 'utf8');
        if (!code) {
          return true;
        }
        try {
          const obfuscationResult = obfuscate(code, {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 0.7,
            numbersToExpressions: true,
            simplify: true,
            stringArrayShuffle: true,
            splitStrings: true,
            stringArrayThreshold: 0.75,
          });
          const dist = join(this.options.outDir, src);
          const dirPath = dirname(dist);
          await mkdir(dirPath, { recursive: true });
          // 写入
          await writeFile(dist, obfuscationResult.getObfuscatedCode());
        } catch (error: any) {
          this.log.error(`[错误] 混淆,文件为 ${src},但错误，原因为: ${error.message}`);
          throw error;
        }
        //
      }),
    );
    this.log.log('[完成] 混淆');
    return results;
  }
}
