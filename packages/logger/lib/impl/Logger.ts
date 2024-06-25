import { DEFAULT_LOGGER } from '../instance';
import { ILogger, LoggerOptions, LogLevel } from '../interfaces';

export class Logger implements ILogger {
  constructor(
    private context?: string,
    private options?: LoggerOptions,
  ) {}
  protected static logLevels?: LogLevel[];
  static log(message: any, ...optionalParams: any[]) {
    Logger.instance.log(message);
  }
  static error(message: any, ...optionalParams: any[]) {
    Logger.instance.error(message);
  }
  static warn(message: any, ...optionalParams: any[]) {
    Logger.instance.warn(message);
  }
  static debug?(message: any, ...optionalParams: any[]) {
    Logger.instance.debug?.(message);
  }
  static verbose?(message: any, ...optionalParams: any[]) {
    Logger.instance.verbose?.(message);
  }
  static fatal?(message: any, ...optionalParams: any[]) {
    Logger.instance.fatal?.(message);
  }
  static formatContext(context: string) {
    return `[${context}]`;
  }
  log(message: any, ...optionalParams: any[]) {
    this.instance.log(Logger.formatContext(this.context || '') + message);
  }
  error(message: any, ...optionalParams: any[]) {
    this.instance.error(Logger.formatContext(this.context || '') + message);
  }
  warn(message: any, ...optionalParams: any[]) {
    this.instance.warn(Logger.formatContext(this.context || '') + message);
  }
  debug?(message: any, ...optionalParams: any[]) {
    this.instance.debug?.(Logger.formatContext(this.context || '') + message);
  }
  verbose?(message: any, ...optionalParams: any[]) {
    this.instance.verbose?.(Logger.formatContext(this.context || '') + message);
  }
  fatal?(message: any, ...optionalParams: any[]) {
    this.instance.fatal?.(Logger.formatContext(this.context || '') + message);
  }
  setLogLevels?(levels: LogLevel[]) {
    Logger.logLevels = levels;
    this.instance.setLogLevels?.(levels);
  }
  protected static instance: ILogger = DEFAULT_LOGGER;
  /**
   * override Logger 就是换个实例，换个实例这样大家还是引入Logger 但不经意间他的实现换了,代码层可以少改代码
   * @param logger
   */
  protected static overrideLogger(logger: Logger) {
    Logger.instance = logger;
  }

  get instance(): ILogger {
    if (Logger.instance) {
      return Logger.instance;
    } else {
      return DEFAULT_LOGGER;
    }
  }
}
