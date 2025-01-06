/**
 * @author
 * @file ResultFactory.ts
 * @fileBase ResultFactory
 * @path packages\result\lib\ResultFactory.ts
 * @from
 * @desc
 * @example
 */
/**
 * 原始输入
 */
export interface OriginResult {
  token: string | string[]; // 业务链条 比如 ['user', 'login']
  // success: boolean; // 成功与否
  status: string | boolean; // 细分状态
  error?: Error; // 错误体 即代码中捕获的错误
  payload?: any; // 其他的数据可以暂存在这里
  // 直接的输出者
  code?: string | number; // code
  message?: string; // 直接的日志消息
}

export interface FriendlyResult extends OriginResult {
  getString: (options?: any) => string;
  getCode: () => string | number;
}

export interface ResultFactoryOptions {
  friendlyMessageBuilder?: (result: OriginResult, options?: any) => string;
  codeBuilder?: (result: OriginResult) => string | number;
}
// 这里使用 abstract 而不是options 更好
export abstract class ResultFactory {
  public createResult(result: OriginResult): FriendlyResult {
    const factory = this;
    return {
      ...result,
      getCode() {
        return this.code ?? factory.getResultCode?.(result) ?? '';
      },
      getString(options) {
        return this.message ?? factory.getResultString?.(this, options) ?? '';
      },
    };
  }
  abstract getResultString(result: OriginResult, options?: any): string;
  abstract getResultCode(result: OriginResult): string | number;
}
