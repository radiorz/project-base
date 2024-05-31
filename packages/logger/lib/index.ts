/**
 * @publicApi
 */
export type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose' | 'fatal';

/**
 * @publicApi
 */
export interface ILogger {
  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]): any;

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]): any;

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]): any;

  /**
   * Write a 'debug' level log.
   */
  debug?(message: any, ...optionalParams: any[]): any;

  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: any, ...optionalParams: any[]): any;

  /**
   * Write a 'fatal' level log.
   */
  fatal?(message: any, ...optionalParams: any[]): any;

  /**
   * Set log levels.
   * @param levels log levels
   */
  setLogLevels?(levels: LogLevel[]): any;
}
export class ConsoleLogger implements ILogger {
  log(message: any, ...optionalParams: any[]) {
    console.log(message);
  }
  error(message: any, ...optionalParams: any[]) {
    console.error(message);
  }
  warn(message: any, ...optionalParams: any[]) {
    console.warn(message);
  }
  debug?(message: any, ...optionalParams: any[]) {
    console.debug(message);
  }
  verbose?(message: any, ...optionalParams: any[]) {
    console.error(message);
  }
  fatal?(message: any, ...optionalParams: any[]) {
    console.error(message);
  }
  setLogLevels?(levels: LogLevel[]) {
    throw new Error('Method not implemented.');
  }
}
export const DEFAULT_LOGGER = new ConsoleLogger();
export interface Options {
  timestamp: boolean
}
export class Logger implements ILogger {
  constructor(
    private context?: string,
    private options?: Options,
  ) {}
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
  static setLogLevels?(levels: LogLevel[]) {
    throw new Error('Method not implemented.');
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
    throw new Error('Method not implemented.');
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
    return Logger.instance;
  }
}
