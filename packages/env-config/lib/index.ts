import { config } from 'dotenv-safe';
import { camelCase, get, merge, set } from 'lodash';

export interface GetOptions {
  path: string;
}
export interface ConfigSource {
  init?: () => void;
  load: () => Record<string, any>;
}

export interface EnvSourceOptions {
  // 层级的分隔符
  delimiter: string;
  // 是否将key 名称转化为 camelCase
  camelCase: boolean;
  allowEmptyValues: boolean;
}

export const DEFAULT_ENV_CONFIG_OPTIONS = {
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
export interface ConfigOptions {
  sources: ConfigSource[];
}
export class ConfigManager {
  config: Record<string, any> = {};
  options: ConfigOptions;
  sources: ConfigSource[] = [];
  constructor(options: ConfigOptions) {
    this.options = options;
    this.sources = this.options.sources;
  }
  static create(options: ConfigOptions) {
    const configManager = new ConfigManager(options);
    configManager.init();
    configManager.load();
    return configManager;
  }
  init() {
    this.sources.forEach((source) => {
      if (source.init) source.init();
    });
  }
  load() {
    // 目前都是同步
    const results = this.sources.map((source) => source.load());
    this.config = merge(this.config, ...results);
  }
  addSource(source: ConfigSource) {
    this.sources.push(source);
    if (source.init) source.init();
    merge(this.config, source?.load());
    return this;
  }
  get(path: string): any;
  get(getOptions?: Partial<GetOptions>): any;
  get(options: any) {
    if (typeof options === 'string') {
      options = { path: options };
    }
    const { path } = options || {};
    if (!path) {
      return this.config;
    }
    let _path = path;
    return get(this.config, _path);
  }
}
export const DEFAULT_ENV_MANAGER = ConfigManager.create({ sources: [new EnvSource()] });
