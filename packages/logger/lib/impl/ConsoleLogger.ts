import { ILogger, LogLevel } from '../interfaces';
export class ConsoleLogger implements ILogger {
  options: any;
  static isLevelEnabled(level: LogLevel, levels: LogLevel[] | undefined) {
    if (!levels) {
      return true;
    }
    return levels.includes(level);
  }
  static buildMessage(message: string, { timestamp }: any) {
    if (timestamp) return `${Date.now()} ${message}`;
    return message;
  }
  log(message: any, ...optionalParams: any[]) {
    if (!ConsoleLogger.isLevelEnabled('log', this.options?.levels)) {
      return;
    }
    console.log(ConsoleLogger.buildMessage(message, { timestamp: this.options?.timestamp }));
  }
  error(message: any, ...optionalParams: any[]) {
    if (!ConsoleLogger.isLevelEnabled('error', this.options?.levels)) {
      return;
    }
    console.error(ConsoleLogger.buildMessage(message, { timestamp: this.options?.timestamp }));
  }
  warn(message: any, ...optionalParams: any[]) {
    if (!ConsoleLogger.isLevelEnabled('warn', this.options?.levels)) {
      return;
    }
    console.warn(ConsoleLogger.buildMessage(message, { timestamp: this.options?.timestamp }));
  }
  debug?(message: any, ...optionalParams: any[]) {
    if (!ConsoleLogger.isLevelEnabled('debug', this.options?.levels)) {
      return;
    }
    console.debug(ConsoleLogger.buildMessage(message, { timestamp: this.options?.timestamp }));
  }
  verbose?(message: any, ...optionalParams: any[]) {
    if (!ConsoleLogger.isLevelEnabled('verbose', this.options?.levels)) {
      return;
    }
    console.error(ConsoleLogger.buildMessage(message, { timestamp: this.options?.timestamp }));
  }
  fatal?(message: any, ...optionalParams: any[]) {
    if (!ConsoleLogger.isLevelEnabled('fatal', this.options?.levels)) {
      return;
    }
    console.error(ConsoleLogger.buildMessage(message, { timestamp: this.options?.timestamp }));
  }
  setLogLevels?(levels: LogLevel[]) {
    if (!this.options) {
      this.options = {};
    }
    this.options.levels = levels;
  }
}
