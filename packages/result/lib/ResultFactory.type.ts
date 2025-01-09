/**
 * @author
 * @file ResultFactory.ts
 * @fileBase ResultFactory
 * @path packages\result\lib\ResultFactory.ts
 * @from
 * @desc
 * @example
 */
export type OriginToken = string | string[] | (() => string | string[]);
/**
 * 原始输入
 */
export interface OriginResult {
  token: OriginToken; // 业务链条 比如 ['user', 'login']
  // success: boolean; // 成功与否
  status: string | boolean; // 细分状态
  level?: string | number; // 日志级别
  error?: Error; // 错误体 即代码中捕获的错误
  payload?: any; // 其他的数据可以暂存在这里
  // 直接的输出者
  code?: string | number; // code
  message?: string; // 直接的日志消息
}
export interface ReuseResult extends OriginResult {
  getCode(): string | number;
  getString(options?: any): string;
  final(): FinalResult;
}
export interface FinalResult {
  code: string | number;
  message: string | string[];
}

// 这里使用 abstract 而不是options 更好
export interface ResultFactory {
  createResult(result: OriginResult): ReuseResult;
}
