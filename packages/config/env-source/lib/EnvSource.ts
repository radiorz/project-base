import { camelCase } from 'lodash';
import { Source } from '@tikkhun/config-core';
import { listToNestedObject } from '@tikkhun/utils-core';
export interface EnvSourceOptions {
  // # key相关
  // ## 过滤前缀 // 包括哪些前缀才获取
  includePrefix?: string | string[];
  excludePrefix?: string | string[];
  // ## 省略前最 比如 {vite.voerka.aaa} 我只需要 aaa这个对象
  shouldRemovedPrefix?: string; // 都是针对原始的数据
  // ## 层级的分隔符
  delimiter: string;
  // ## 是否将key 名称转化为 camelCase
  camelCase: boolean;

  // # value 相关
  valueTransformer: (key: string, value: any) => any;
  // initEnv(): void;
  // loadEnv(): Record<string, any>;
}

export abstract class EnvSource implements Source {
  static defaultOptions: EnvSourceOptions = {
    // key相关
    includePrefix: undefined, // 这里可能可以包括多个
    excludePrefix: undefined, // 排除的
    shouldRemovedPrefix: undefined, // 路径简化
    delimiter: '__',
    camelCase: true,
    // 这个其实要强制实现
    // initEnv() {},
    // loadEnv() {
    //   return {};
    // },
    // 原始的.env很可能都是string，可以在此转换转换
    valueTransformer(_, value: any) {
      return value;
    },
  };
  options: EnvSourceOptions;
  constructor(options?: Partial<EnvSourceOptions>) {
    this.options = Object.assign({}, EnvSource.defaultOptions, options);
  }
  // 是否做到options中比较合适
  abstract initEnv(): boolean;
  abstract getEnv(): Record<string, any>;
  init() {
    // 初始化获取 env 依赖
    this.initEnv();
  }

  load() {
    const {
      delimiter,
      includePrefix,
      excludePrefix,
      shouldRemovedPrefix,
      valueTransformer,
      camelCase: camelCaseOption,
    } = this.options;
    // 获取原始数据
    const env = this.getEnv();

    const list = Object.entries(env)
      .filter(([key]) => {
        return isIncludePrefix(key, includePrefix) && !isExcludeByPrefix(key, excludePrefix);
      })
      .map(([key, value]) => {
        return {
          key: removePrefix(key, shouldRemovedPrefix),
          value: valueTransformer(key, value),
        };
      });
    // console.log(`list`, list);
    // 转换成对象
    return listToNestedObject({
      delimiter,
      keyItemTransformer(item: string) {
        if (camelCaseOption) return camelCase(item);
        return item;
      },
      list,
    });
  }
}
export function removePrefix(str: string, prefix?: string) {
  if (!str) return str;
  if (!prefix) return str;
  const regex = new RegExp(`^${prefix}`);
  return str.replace(regex, '');
}
export function isIncludePrefix(str: string, prefix?: string | string[]) {
  if (!str) return false;
  if (!prefix) return true;
  const prefixes = Array.isArray(prefix) ? prefix : [prefix];
  // 只要一个符合就行了
  for (const _prefix of prefixes) {
    const isInclude = str.startsWith(_prefix);
    if (!isInclude) {
      continue;
    }
    return true;
  }
  return false;
}
export function isExcludeByPrefix(str: string, prefix?: string | string[]) {
  if (!prefix) return false;
  const prefixes = Array.isArray(prefix) ? prefix : [prefix];
  // 只要一个符合就行了
  for (const _prefix of prefixes) {
    const isExclude = str.startsWith(_prefix);
    if (!isExclude) {
      continue;
    }
    return true;
  }
  return false;
}
