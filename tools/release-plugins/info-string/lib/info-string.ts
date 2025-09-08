/**
 * @author
 * @file ReleaseName.ts
 * @fileBase ReleaseName
 * @path tools\release-tools\lib\ReleaseName.ts
 * @from
 * @desc
 * @example
 */
// 为何将name从info拆除，是因为可能要同时修改多个filename, 比如apk本身的名字，我这个只是releaseName.

import { mergeOptions, UnderlineDelimiter } from '@tikkhun/utils-core';
import type { Info } from '@tikkhun/info';
import _ from 'lodash';
import { strategyNames, TRANSFORMERS } from './manyStrategy';
const { get, set } = _; // FIXME 这里为了避免无法使用，不知道有啥好方法没有

// export type Param = keyof Info;
export interface InfoStringOptions {
  info: Info;
  params: string[];
  paramDelimiter: string;
  paramTransformers: {
    [key: string]: string /**pipe*/ | ((value: any, options?: any) => string); // string 是特殊的，就是我已经注册的函数
  };
}

export class InfoString {
  static defaultOptions: InfoStringOptions = {
    info: {},
    params: ['name', 'version', 'releasedAt'],
    paramTransformers: {
      name: strategyNames['deleteScope'],
      releasedAt: strategyNames['YYYY-MM-DD-HH-mm-ss'],
    },
    paramDelimiter: UnderlineDelimiter,
  };
  options: InfoStringOptions;
  constructor(options?: Partial<InfoStringOptions>) {
    this.options = mergeOptions(InfoString.defaultOptions, options);
  }
  getParamTransformer(key: string) {
    const transformerDefines = this.options.paramTransformers;
    const transformer = transformerDefines[key];
    if (!transformer) {
      return TRANSFORMERS.default;
    }
    if (typeof transformer === 'function') {
      return transformer;
    }
    if (typeof transformer === 'string' && TRANSFORMERS.hasOwnProperty(transformer)) {
      return TRANSFORMERS[transformer as keyof typeof TRANSFORMERS];
    }
    return TRANSFORMERS.default;
  }
  // 字符串化有几种方案：
  // - 采用pattern的定义形式 "{app}{yyy}" 但这个有个不好的就是不能parse成原本的配置对象 好处是最灵活
  // - 采用数组排列形式，这个只规定了值的顺序，分隔符，所以可以parse成原本参数， 好处是可以parse， 坏处是不够灵活,但是其实大部分情况我们不需要那么灵活 所以直接这样限制一下吧。
  // 目前采用第二种
  stringify(): string {
    const paramValues = this.options.params.map((key) => {
      return this.getParamTransformer(key)(get(this.options.info, key));
    });
    const paramStr = paramValues.join(this.options.paramDelimiter);

    return validateAndReplaceFileName(paramStr);
  }

  // 这个parse并不能完全还原原本的info对象，但可以大致还原一个大概
  parse(str: string): Record<string, any> {
    const paramObj: Record<string, string> = {};
    const values = str.split(this.options.paramDelimiter);
    this.options.params.forEach((param, index) => {
      // 根据params规定的位置取出字符串中的值,赋值给变量对象
      set(paramObj, param, values[index]);
    });
    return paramObj;
  }
}

export function validateAndReplaceFileName(filename: string, replaceText = '@') {
  const illegalChars = /[\\/:*?"<>|]/g;
  const illegalChar = illegalChars.test(filename);
  if (illegalChar) {
    console.log(`文件名包含非法字符，已自动替换为${replaceText}`);
    return filename.replace(illegalChars, replaceText);
  }
  return filename;
}
