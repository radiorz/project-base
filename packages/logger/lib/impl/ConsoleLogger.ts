import { ILogger, LogLevel } from '../interfaces';
export class ConsoleLogger implements ILogger {
  options: any;
  static isLevelEnabled(level: LogLevel, levels: LogLevel[] | undefined) {
    if (!levels) {
      return true;
    }
    return levels.includes(level);
  }
  log(message: any, ...optionalParams: any[]) {
    if (!ConsoleLogger.isLevelEnabled('log', this.options?.levels)) {
      return;
    }
    console.log(message);
  }
  error(message: any, ...optionalParams: any[]) {
    if (!ConsoleLogger.isLevelEnabled('error', this.options?.levels)) {
      return;
    }
    console.error(message);
  }
  warn(message: any, ...optionalParams: any[]) {
    if (!ConsoleLogger.isLevelEnabled('warn', this.options?.levels)) {
      return;
    }
    console.warn(message);
  }
  debug?(message: any, ...optionalParams: any[]) {
    if (!ConsoleLogger.isLevelEnabled('debug', this.options?.levels)) {
      return;
    }
    console.debug(message);
  }
  verbose?(message: any, ...optionalParams: any[]) {
    if (!ConsoleLogger.isLevelEnabled('verbose', this.options?.levels)) {
      return;
    }
    console.error(message);
  }
  fatal?(message: any, ...optionalParams: any[]) {
    if (!ConsoleLogger.isLevelEnabled('fatal', this.options?.levels)) {
      return;
    }
    console.error(message);
  }
  setLogLevels?(levels: LogLevel[]) {
    if (!this.options) {
      this.options = {};
    }
    this.options.levels = levels;
  }
}
