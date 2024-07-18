import { config } from 'dotenv-safe';
import { camelCase, set } from 'lodash';
import { ConfigSource } from './ConfigSource';
export interface EnvSourceOptions {
  prefix: string;
  // 层级的分隔符
  delimiter: string;
  // 是否将key 名称转化为 camelCase
  camelCase: boolean;
  allowEmptyValues: boolean;
}

export const DEFAULT_ENV_CONFIG_OPTIONS = {
  prefix: '',
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
    // 构成对象
    const env = {};
    for (const [key, value] of Object.entries(process.env)) {
      if (this.options.prefix && !key.startsWith(this.options.prefix)) {
        // 这里排除前缀不为设置的前缀的配置，这样可以缩小范围
        continue;
      }
      const keys = key.split(this.options.delimiter);
      let _key;
      if (this.options.camelCase) {
        _key = keys.map(camelCase).join('.');
      } else {
        _key = keys.join('.');
      }
      set(env, _key, value);
    }
    return env;
  }
}
