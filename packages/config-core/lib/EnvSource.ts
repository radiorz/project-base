import { camelCase } from 'lodash';
import { ConfigSource } from './';
import { listToJson } from '@tikkhun/utils-core';
export interface EnvSourceOptions {
  // 过滤前缀 // 包括哪些前缀才获取
  includePrefix?: string | string[];
  excludePrefix?: string | string[];
  // 省略前最 比如 {vite.voerka.aaa} 我只需要 aaa这个对象
  shouldRemovedPrefix?: string; // 都是针对原始的数据
  // 层级的分隔符
  delimiter: string;
  // 是否将key 名称转化为 camelCase
  camelCase: boolean;
}

export abstract class EnvSource implements ConfigSource {
  static defaultOptions: EnvSourceOptions = {
    includePrefix: undefined, // 这里可能可以包括多个
    excludePrefix: undefined, // 排除的
    shouldRemovedPrefix: undefined, // 路径简化
    delimiter: '__',
    camelCase: true,
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
    const { delimiter, includePrefix, excludePrefix, shouldRemovedPrefix, camelCase: camelCaseOption } = this.options;
    // 获取原始数据
    const env = this.getEnv();

    const list = Object.entries(env)
      .filter(([key]) => {
        return isIncludePrefix(key, includePrefix) && !isExcludeByPrefix(key, excludePrefix);
      })
      .map(([key, value]) => {
        return {
          key: removePrefix(key, shouldRemovedPrefix),
          value,
        };
      });
    console.log(`list`, list);
    // 转换成对象
    return listToJson({
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
