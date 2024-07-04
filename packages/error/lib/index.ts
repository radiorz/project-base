/**
 * 为什么要写这些 主要是
 */
import _ from 'lodash';
const { merge } = _;
interface TkErrorOptions {
  message: string;
  code: string | number;
  i18n: boolean;
  i18nAdapter: (message: string) => string;
}
const defaultOptions: TkErrorOptions = {
  message: '',
  code: 1,
  i18n: false,
  i18nAdapter: (message: string) => message, // 等于5️无
};
export class TkError extends Error {
  opts: TkErrorOptions = defaultOptions;
  constructor(options: Partial<TkErrorOptions>) {
    let finalMessage = options.message || defaultOptions.message;
    if (options.i18n) {
      const i18nAdapter = options.i18nAdapter || defaultOptions.i18nAdapter;
      finalMessage = i18nAdapter(finalMessage);
    }
    super(finalMessage);
    this.opts = merge(this.opts, options);
  }
}

export class ErrorManager {
  static init() {
    (globalThis as any).TkError = TkError;
  }
}
