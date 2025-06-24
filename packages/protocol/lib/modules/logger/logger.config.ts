export interface LogConfig {
  enabled: boolean;
  level: LogLevel;
  output: string[]; // server file console
  outputConfig: Record<string, any>; // {server: {url: },file: {maxFileSize: number, maxFileCount: number}}
}

export enum LogLevel {
  // 日志级别
  // - =1
  DEBUG,
  // - =2
  INFO,
  // - =3
  WARN,
  // - =4
  ERROR,
}
