import { config } from 'dotenv-safe';
import { camelCase, set } from 'lodash';
import { ConfigSource } from '@tikkhun/config-core';
import { listToJson } from '@tikkhun/utils-core';
export interface EnvSourceOptions {
  includePrefix: string;
  // 层级的分隔符
  delimiter: string;
  // 是否将key 名称转化为 camelCase
  camelCase: boolean;
  allowEmptyValues: boolean;
}

export const DEFAULT_ENV_CONFIG_OPTIONS = {
  includePrefix: '',
  delimiter: '__',
  camelCase: true,
  allowEmptyValues: true,
};
export class EnvSource implements ConfigSource {
  options: EnvSourceOptions;
  constructor(options?: Partial<EnvSourceOptions>) {
    this.options = Object.assign(DEFAULT_ENV_CONFIG_OPTIONS, options);
  }
  init() {
    // 初始化获取 env 依赖
    config({ allowEmptyValues: this.options.allowEmptyValues });
  }
  load() {
    const { delimiter, includePrefix, camelCase: camelCaseOption } = this.options;
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
      list: Object.entries(process.env).map(([key, value]) => {
        return {
          key,
          value,
        };
      }),
    });
  }
}
