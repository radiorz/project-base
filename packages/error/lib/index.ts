/**
 * 为什么要写这些 主要是
 */
import _ from 'lodash';
const { merge } = _;
interface TkErrorOptions {
  message: string;
  // i18n: boolean;
  i18nAdapter: (message: string) => string;
}
const defaultOptions: TkErrorOptions = {
  message: '',
  // i18n: false,
  i18nAdapter: (message: string) => message, // 等于5️无
};
export class TkError extends Error {
  opts: TkErrorOptions = defaultOptions;
  constructor(options: Partial<TkErrorOptions>) {
    const message = options.message || defaultOptions.message;
    const i18nAdapter = options.i18nAdapter || defaultOptions.i18nAdapter;
    const finalMessage = i18nAdapter(message);
    super(finalMessage);
    this.opts = merge(this.opts, options);
  }
}

export class ErrorManager {
  static init() {
    (globalThis as any).TkError = TkError;
  }
}
