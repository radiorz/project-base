import { camelCase } from 'lodash';
import { ConfigSource } from './';
import { listToJson } from '@tikkhun/utils-core';
export interface EnvSourceOptions {
  // 过滤前缀
  includePrefix: string;
  // 层级的分隔符
  delimiter: string;
  // 是否将key 名称转化为 camelCase
  camelCase: boolean;
}

export abstract class EnvSource implements ConfigSource {
  static defaultOptions = {
    includePrefix: '',
    delimiter: '__',
    camelCase: true,
  };
  options: EnvSourceOptions;
  constructor(options?: Partial<EnvSourceOptions>) {
    this.options = Object.assign({}, EnvSource.defaultOptions, options);
  }
  abstract initEnv(): boolean;
  abstract getEnv(): Record<string, any>;
  init() {
    // 初始化获取 env 依赖
    this.initEnv();
  }
  load() {
    const { delimiter, includePrefix, camelCase: camelCaseOption } = this.options;
    const env = this.getEnv();
    return listToJson({
      delimiter,
      isKeyInclude(key: string) {
        if (!includePrefix) {
          return true;
        }
        return key.startsWith(includePrefix);
      },
      keyItemTransformer(item: string) {
        if (camelCaseOption) return camelCase(item);
        return item;
      },
      list: Object.entries(env).map(([key, value]) => {
        return {
          key,
          value,
        };
      }),
    });
  }
}
