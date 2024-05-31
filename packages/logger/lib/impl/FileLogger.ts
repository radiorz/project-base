/**
 * @author
 * @file FileLogger.ts
 * @fileBase FileLogger
 * @path packages\logger\lib\FileLogger.ts
 * @from
 * @desc
 * @todo
 *
 *
 * @done
 * @example
 */

import { ILogger, LogLevel } from '../interfaces';

export class FileLogger implements ILogger {
  constructor() {
    // Object.assign(this, options);
  }
  log(message: any, ...optionalParams: any[]) {
    throw new Error('Method not implemented.');
  }
  error(message: any, ...optionalParams: any[]) {
    throw new Error('Method not implemented.');
  }
  warn(message: any, ...optionalParams: any[]) {
    throw new Error('Method not implemented.');
  }
  debug?(message: any, ...optionalParams: any[]) {
    throw new Error('Method not implemented.');
  }
  verbose?(message: any, ...optionalParams: any[]) {
    throw new Error('Method not implemented.');
  }
  fatal?(message: any, ...optionalParams: any[]) {
    throw new Error('Method not implemented.');
  }
  setLogLevels?(levels: LogLevel[]) {
    throw new Error('Method not implemented.');
  }
}
