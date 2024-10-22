/**
 * @author
 * @file ReleaseStoreInfo.ts
 * @fileBase ReleaseStoreInfo
 * @path tools\release-tools\lib\ReleaseStoreInfo.ts
 * @from
 * @desc
 * @example
 */

import { optionsMerge } from '@tikkhun/utils-core';
import dayjs from 'dayjs';
import { XMLBuilder } from 'fast-xml-parser';
import _ from 'lodash';
import { Info } from './InfoBuilder/InfoBuilder';
import { transformObjectByOptionsMap } from './object.utils';
import { AfterInputGot } from './ReleasePlugin';
const { isEmpty } = _;
export type TransformMap = Record<string, string>;
// 目前想到的就是用  archive 进行打包。
export interface ReleaseInfoStoreOptions {
  info: Info;
  transformMap?: TransformMap; // 转换标准
  releasedAtPattern: string;
  path: string; // 路径
}
export interface InfoTransformOptions {
  // 原本的值
  originItems: Record<string, any>;
  // 转换关系
  transformMap?: TransformMap;
}

export class ReleaseInfoStorePlugin implements AfterInputGot {
  static defaultOptions: ReleaseInfoStoreOptions = Object.freeze({
    info: {},
    transformMap: {},
    releasedAtPattern: 'YYYY-MM-DD-HH-mm-ss',
    path: 'released_info.json',
  });
  options: ReleaseInfoStoreOptions;
  constructor(options?: Partial<ReleaseInfoStoreOptions>) {
    this.options = optionsMerge(ReleaseInfoStorePlugin.defaultOptions, options);
  }
  // 由于过于简单，所以不再封装
  static transformKeys(options: InfoTransformOptions) {
    if (isEmpty(options.transformMap)) return options.originItems;
    return transformObjectByOptionsMap(options.originItems, options.transformMap);
  }
  transformValues() {
    return {
      ...this.options.info,
      releasedAt: this.getReleasedAt(this.options.info.releasedAt),
    };
  }
  private getReleasedAt(releasedAt?: number | null) {
    return dayjs(releasedAt).format(this.options.releasedAtPattern);
  }
  private getInfo() {
    const originItems = this.transformValues();
    const transformedInfo = ReleaseInfoStorePlugin.transformKeys({
      originItems,
      transformMap: this.options.transformMap,
    });
    return transformedInfo;
  }
  afterInputGot(archive: any) {
    const info = this.getInfo();
    if (this.options.path.endsWith('json')) {
      return archive.append(JSON.stringify(info, null, 2), {
        name: this.options.path,
      });
    }
    if (this.options.path.endsWith('xml')) {
      const xmlBuilder = new XMLBuilder();
      const content = xmlBuilder.build(info);
      return archive.append(content, {
        name: this.options.path,
      });
    }
    throw new Error('[释放信息文件]暂未实现保存此种文件' + this.options.path);
  }
}