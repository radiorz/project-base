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
const defaultBestResultFactoryOptions = {
  codeJson: {},
  messageMap: new Map<string, JSON>(),
  defaultLanguage: 'zh',
};
type BestResultFactoryOptions = typeof defaultBestResultFactoryOptions;
export class BestResultFactory {
  static defaultOptions: BestResultFactoryOptions = Object.freeze(defaultBestResultFactoryOptions);
  options: BestResultFactoryOptions;
  resultFactory: ResultFactory;
  get currentMessageMap() {
    return this.options.messageMap.get(this.options.defaultLanguage);
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
  getChainString(chain: string | string[]) {
    return typeof chain === 'string' ? chain : chain.join('.');
  }
  // TODO 这里需要搞个插值不然有时候不够清晰
  private friendlyMessageBuilder(result: OriginResult) {
    return get(this.currentMessageMap, this.getChainString(result.bizChain));
  }
  private codeBuilder(result: OriginResult) {
    return get(this.options.codeJson, this.getChainString(result.bizChain));
  }
  // 添加或更新code
  upsertCode(chain: string | string[], code: string | number) {
    set(this.options.codeJson, typeof chain === 'string' ? chain : chain.join('.'), code);
  }
  // 删除code
  removeCode(chain: string | string[]) {
    set(this.options.codeJson, typeof chain === 'string' ? chain : chain.join('.'), undefined);
  }
  // 不同语言的message集合
  addLanguage(language: string, messageMap: JSON) {
    this.options.messageMap.set(language, messageMap);
  }
  changeLanguage(language: string) {
    if (this.options.messageMap.has(language)) {
      this.options.defaultLanguage = language;
    }
  }
}
