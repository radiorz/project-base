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

import { UnderlineDelimiter } from '@tikkhun/utils-core';
import type { Info } from './InfoManager';
export type Param = keyof Info;

export interface ReleaseNameOptions {
  info: Info;
  params: Param[];
  paramDelimiter: string;
  //
  releasedAtPattern: string;
}

export class ReleaseName {
  static defaultOptions: ReleaseNameOptions = {
    info: {},
    params: ['name', 'version', 'tag', 'releasedAt', 'system', 'hardware'],
    paramDelimiter: UnderlineDelimiter,
    releasedAtPattern: 'YYYY-MM-DD-HH-mm-ss',
  };
  options: ReleaseNameOptions;
  constructor(options?: Partial<ReleaseNameOptions>) {
    this.options = Object.assign({}, ReleaseName.defaultOptions, options);
  }
  // 字符串化有几种方案：
  // - 采用pattern的定义形式 "{app}{yyy}" 但这个有个不好的就是不能parse成原本的配置对象 好处是最灵活
  // - 采用数组排列形式，这个只规定了值的顺序，分隔符，所以可以parse成原本参数， 好处是可以parse， 坏处是不够灵活,但是其实大部分情况我们不需要那么灵活 所以直接这样限制一下吧。
  // 目前采用第二种
  stringify(): string {
    return this.options.params.map((param) => this.options.info?.[param]).join(this.options.paramDelimiter);
  }
  parse(str: string): Record<string, any> {
    const paramObj: Record<string, string> = {};
    const values = str.split(this.options.paramDelimiter);
    this.options.params.forEach((param, index) => {
      // 根据params规定的位置取出字符串中的值,赋值给变量对象
      paramObj[param] = values[index];
    });
    return paramObj;
  }
}
