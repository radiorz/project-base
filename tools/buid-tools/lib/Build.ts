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
import { merge } from 'lodash';
import { mkdir, rm } from 'node:fs/promises';
import path from 'path';
import { Copier, CopierOptions } from './Copier';
import { Obfuscator, ObfuscatorOptions } from './Obfuscator';
export interface BuildOptions {
  workspace: string;
  outDir: string;
  copyOptions: Partial<Omit<CopierOptions, 'outDir'>>;
  obfuscateOptions: { enabled: boolean } & Partial<Omit<ObfuscatorOptions, 'outDir'>>;
}
export class Build {
  log = new Logger('Build');
  static defaultOptions: BuildOptions = {
    workspace: process.cwd(),
    outDir: 'dist',
    copyOptions: Copier.defaultOptions,
    obfuscateOptions: {
      ...Obfuscator.defaultOptions,
      enabled: true,
    },
  };
  options: BuildOptions;
  constructor(options?: Partial<BuildOptions>) {
    this.options = merge({}, Build.defaultOptions, options);
  }
  get outDir() {
    return path.join(this.options.workspace, this.options.outDir);
  }
  // watchError() {
  //   process.on()
  // }
  async start() {
    this.log.log('start');
    this.log.log('[说明] 最终选项配置:' + JSON.stringify(this.options, null, 2));
    await this.cleanOutDir();
    await this.ensureOutDir();
    // 拷贝到 dist
    const copier = new Copier({ ...this.options.copyOptions, outDir: this.options.outDir });
    await copier.start();
    // obfuscate js 到 dist
    if (this.options.obfuscateOptions.enabled) {
      const obfuscator = new Obfuscator({ ...this.options.obfuscateOptions, outDir: this.options.outDir });
      await obfuscator.start();
    }
    this.log.log('end');
  }
  stop() {
    this.cleanOutDir();
  }
  cleanOutDir() {
    return rm(this.options.outDir, { recursive: true, force: true });
  }
  ensureOutDir() {
    return mkdir(this.options.outDir, { recursive: true });
  }
}

