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
interface OriginResult {
  success: boolean; // 成功与否
  bizChain: string[]; // 业务链条 比如 ['user', 'login']
  error?: Error; // 错误体 即代码中捕获的错误
  payload?: any; // 其他的数据可以暂存在这里
  // 直接的输出者
  code?: string | number; // code
  message?: string; // 直接的日志消息
}

export interface FriendlyResult extends OriginResult {
  getFriendlyMessage: string;
  getCode: string | number;
}

export interface ResultFactoryOptions {
  friendlyMessageBuilder?: (result: OriginResult) => string;
  codeBuilder?: (result: OriginResult) => string | number;
}

export class ResultFactory {
  static defaultOptions: ResultFactoryOptions = Object.freeze({});
  options: ResultFactoryOptions;
  constructor(options?: Partial<ResultFactoryOptions>) {
    this.options = Object.assign({}, ResultFactory.defaultOptions, options);
  }
  createResult(result: OriginResult): FriendlyResult {
    return {
      ...result,
      getFriendMessage: () => result.message ?? this.options.friendlyMessageBuilder?.(result) ?? '',
      getCode: () => result.code ?? this.options.getCode?.(result) ?? 1,
    };
  }
}
