/**
 * @author
 * @file ReleaseInfo.ts
 * @fileBase ReleaseInfo
 * @path tools\release-tools\lib\ReleaseInfo.ts
 * @from
 * @desc
 * @example
 */

import { Info } from './InfoManager';
import { transformObjectByOptionsMap } from './object.utils';

export type TransformMap = Record<string, string>;
export interface InfoTransformOptions {
  // 原本的值
  originItems: Info;
  // 转换关系
  transformMap?: TransformMap;
}

export class ReleaseInfoTransformer {
  // 由于过于简单，所以不再封装
  static transform(options: InfoTransformOptions) {
    if (!options?.transformMap) return options.originItems;
    return transformObjectByOptionsMap(options.originItems, options.transformMap);
  }
}
