/**
 * @author
 * @file BestResultFactory.ts
 * @fileBase BestResultFactory
 * @path packages\result\lib\BestResultFactory.ts
 * @from
 * @desc
 * @example
 */

import { get } from 'lodash';
import { ReuseResult, FinalResult, OriginResult, OriginToken, ResultFactory } from './ResultFactory.type';
import { optionsMerge } from '@tikkhun/utils-core';
// import { params } from './utils/params';
import { replaceParams } from '@tikkhun/utils-core';
const defaultResultFactoryOptions = {
  messageMap: new Map<string, Record<string, any>>(),
  // defaultLocale: undefined, // undefined貌似不支持
  ignoreError: true, // 忽略一些未找到的错误
  tokenPattern: '{token}.{status}',
};
type ResultFactoryOptions = typeof defaultResultFactoryOptions & { defaultLocale?: string };
export class ResultFactoryImpl implements ResultFactory {
  static defaultOptions: ResultFactoryOptions = Object.freeze(defaultResultFactoryOptions);
  options: ResultFactoryOptions;
  getCurrentMessageMap(locale?: string) {
    if (!locale && !this.options.defaultLocale) {
      return null;
    }
    return this.options.messageMap.get(locale || this.options.defaultLocale!);
  }
  constructor(options?: Partial<ResultFactoryOptions>) {
    this.options = optionsMerge(ResultFactoryImpl.defaultOptions, options);
  }

  createResult(result: OriginResult): ReuseResult {
    const factory = this;
    const reuseResult: ReuseResult = {
      ...result,
      getCode() {
        return factory.getResultCode(this);
      },
      getString(language?: string) {
        return factory.getResultString(this, language);
      },
      final(): FinalResult {
        return Object.freeze({
          code: this.getCode(),
          message: this.getString(),
        });
      },
    };
    return reuseResult;
  }
  private getResultString(result: ReuseResult, language?: string) {
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
    return replaceParams(messageTemplate, { ...result.payload, error: result.error?.message });
  }
  private getResultCode(result: ReuseResult): string | number {
    return this.getMessageToken(result);
  }

  private getStatusToken(status: string | boolean) {
    return typeof status === 'boolean' ? (status ? 'success' : 'error') : status;
  }
  private getMessageToken(result: ReuseResult) {
    // 这里前置正确错误是因为大家更关注错误, 有时候甚至只用写错误，可以省略众多括号{}
    return replaceParams(this.options.tokenPattern, {
      token: getTokenStr(result.token),
      status: this.getStatusToken(result.status),
    });
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
export function getTokenStr(token: OriginToken) {
  if (typeof token === 'function') {
    token = token();
  }
  if (Array.isArray(token)) {
    return token.join('.');
  }
  return token;
}
