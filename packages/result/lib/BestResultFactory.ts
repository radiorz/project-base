/**
 * @author
 * @file BestResultFactory.ts
 * @fileBase BestResultFactory
 * @path packages\result\lib\BestResultFactory.ts
 * @from
 * @desc
 * @example
 */

import { ResultFactory } from './ResultFactory';
type bizChain = string;
export interface BestResultFactoryOptions {
  codeMap: Map<bizChain, any>;
  messageMap: Map<bizChain, any>; // 这里应该融合了i18n
}

export class BestResultFactory extends ResultFactory {
  static defaultOptions: BestResultFactoryOptions = Object.freeze({});
  options: BestResultFactoryOptions;
  constructor(options?: Partial<BestResultFactoryOptions>) {
    this.options = Object.assign({}, BestResultFactory.defaultOptions, options);
  }
  addCodeMap() {
    this.options.codeMap.set(key, value);
  }
  // 不同语言
  addLanguage() {}
  toggleLanguage() {}
  addMessageMap() {}
}
// 日志
