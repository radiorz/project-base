/**
 * @author
 * @file ProcessEnvSource.ts
 * @fileBase ProcessEnvSource
 * @path packages\node-config\lib\ProcessEnvSource.ts
 * @from
 * @desc
 * @todo
 *
 *
 * @done
 * @example
 */

import { config } from 'dotenv-safe';
import { EnvSource, EnvSourceOptions } from '@tikkhun/env-source';

export interface ProcessEnvSourceOptions extends EnvSourceOptions {
  allowEmptyValues: boolean;
}
export class ProcessEnvSource extends EnvSource {
  static defaultOptions: ProcessEnvSourceOptions = {
    ...EnvSource.defaultOptions,
    allowEmptyValues: true,
  };
  options: ProcessEnvSourceOptions;
  constructor(options?: Partial<ProcessEnvSourceOptions>) {
    super(options);
    this.options = Object.assign(ProcessEnvSource.defaultOptions, options);
  }
  initEnv() {
    // 初始化获取 env 依赖
    config({ allowEmptyValues: this.options.allowEmptyValues });
    return true;
  }
  getEnv(): Record<string, any> {
    return process.env;
  }
}
