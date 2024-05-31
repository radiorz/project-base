import { ILogger, LogLevel } from '../interfaces';

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
