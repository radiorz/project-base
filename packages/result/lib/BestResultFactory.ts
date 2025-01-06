/**
 * @author
 * @file BestResultFactory.ts
 * @fileBase BestResultFactory
 * @path packages\result\lib\BestResultFactory.ts
 * @from
 * @desc
 * @example
 */

import { get, set } from 'lodash';
import { OriginResult, ResultFactory } from './ResultFactory';
import { optionsMerge } from '@tikkhun/utils-core';
import { params } from './utils/params';
const defaultBestResultFactoryOptions = {
  messageMap: new Map<string, Record<string, any>>(),
  // defaultLocale: undefined, // undefined貌似不支持
  ignoreError: true, // 忽略一些未找到的错误
};
type BestResultFactoryOptions = typeof defaultBestResultFactoryOptions & { defaultLocale?: string };
export class BestResultFactory {
  static defaultOptions: BestResultFactoryOptions = Object.freeze(defaultBestResultFactoryOptions);
  options: BestResultFactoryOptions;
  resultFactory: ResultFactory;
  getCurrentMessageMap(locale?: string) {
    if (!locale && !this.options.defaultLocale) {
      return null;
    }
    return this.options.messageMap.get(locale || this.options.defaultLocale!);
  }
  constructor(options?: Partial<BestResultFactoryOptions>) {
    this.options = optionsMerge(BestResultFactory.defaultOptions, options);
    this.resultFactory = new ResultFactory({
      friendlyMessageBuilder: this.friendlyMessageBuilder.bind(this),
      codeBuilder: this.codeBuilder.bind(this),
    });
  }
  createResult(result: OriginResult) {
    return this.resultFactory.createResult(result);
  }
  private getChainString(chain: string | string[]) {
    return typeof chain === 'string' ? chain : chain.join('.');
  }
  private getMessageToken(result: Pick<OriginResult, 'success' | 'token'>) {
    return `${result.success ? 'success' : 'error'}.` + this.getChainString(result.token);
  }
  private friendlyMessageBuilder(result: OriginResult, language?: string) {
    const messageTemplate = get(this.getCurrentMessageMap(language), this.getMessageToken(result));
    // 没有对应的message
    if (!messageTemplate) {
      // ignore error
      if (this.options.ignoreError) {
        return '';
      } else {
        throw new Error('no message found');
      }
    }
    // 搞个简单的插值
    return params(messageTemplate, { ...result.payload, error: result.error?.message });
  }
  private codeBuilder(result: OriginResult) {
    return this.getMessageToken(result);
  }

  // 不同语言的message集合
  addLocale(name: string, messageMap: Record<string, any>) {
    if (!this.options.defaultLocale) {
      this.options.defaultLocale = name;
    }
    this.options.messageMap.set(name, messageMap);
  }
  changeLocale(name: string) {
    if (this.options.messageMap.has(name)) {
      this.options.defaultLocale = name;
    }
  }
}
