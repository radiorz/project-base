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
import { FriendlyResult, OriginResult, ResultFactory } from './ResultFactory';
import { optionsMerge } from '@tikkhun/utils-core';
import { params } from './utils/params';
const defaultBestResultFactoryOptions = {
  messageMap: new Map<string, Record<string, any>>(),
  // defaultLocale: undefined, // undefined貌似不支持
  ignoreError: true, // 忽略一些未找到的错误
  tokenPattern: '{token}.{status}',
};
type BestResultFactoryOptions = typeof defaultBestResultFactoryOptions & { defaultLocale?: string };
export class BestResultFactory extends ResultFactory {
  static defaultOptions: BestResultFactoryOptions = Object.freeze(defaultBestResultFactoryOptions);
  options: BestResultFactoryOptions;
  getCurrentMessageMap(locale?: string) {
    if (!locale && !this.options.defaultLocale) {
      return null;
    }
    return this.options.messageMap.get(locale || this.options.defaultLocale!);
  }
  constructor(options?: Partial<BestResultFactoryOptions>) {
    super();
    this.options = optionsMerge(BestResultFactory.defaultOptions, options);
  }
  // @overload
  createResult(result: OriginResult) {
    // 创建result 然后可以不断变换他的状态对实际情况更有利
    const finalResult = super.createResult(result);
    const code = finalResult.getCode();
    // 直接获取心智低
    return {
      ...finalResult, // 其实这里就没必要有 getCode了 算了还是先保留着吧
      code,
      _status: finalResult.status, 
      get status() {
        return this._status;
      },
      set status(status: string | boolean) {
        this.code = this.getCode();
        this._status = status;
      },
      // message: finalResult.getString(), //
    };
  }
  getResultString(result: OriginResult, language?: string) {
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
  getResultCode(result: OriginResult) {
    return this.getMessageToken(result);
  }

  private getChainString(chain: string | string[]) {
    return typeof chain === 'string' ? chain : chain.join('.');
  }
  private getStatusToken(status: string | boolean) {
    return typeof status === 'boolean' ? (status ? 'success' : 'error') : status;
  }
  private getMessageToken(result: Pick<OriginResult, 'status' | 'token'>) {
    // 这里前置正确错误是因为大家更关注错误, 有时候甚至只用写错误，可以省略众多括号{}
    const token = this.getChainString(result.token);
    return params(this.options.tokenPattern, {
      token,
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
