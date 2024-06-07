import { config } from 'dotenv-safe';
import { camelCase, get, merge, set } from 'lodash';
const DEFAULT_DELIMITER = '__';

export interface Options {
  // 层级的分隔符
  delimiter: string;
  // 是否将key 名称转化为 camelCase
  camelCase: boolean;
  allowEmptyValues: boolean;
  load?: (() => any)[];
}
export const DEFAULT_OPTIONS = {
  delimiter: DEFAULT_DELIMITER,
  camelCase: true,
  allowEmptyValues: true,
};
export interface GetOptions {
  path: string;
}
export class EnvManager {
  env: Record<string, any> = {};
  options: Options;
  constructor(options?: Partial<Options>) {
    this.options = Object.assign(DEFAULT_OPTIONS, options);
  }
  static create(options?: Partial<Options>) {
    const envManager = new EnvManager(options);
    envManager.init();
    return envManager;
  }
  init() {
    this.env = this.loadEnv();
    if (this.options.load && this.options.load.length >= 0) {
      // 自定义加载
      const results = this.options.load.map((l) => l()); // 暂时先全部都是同步方法，后面在想着异步流程
      // merge
      merge(this.env, ...results);
    }
  }
  loadEnv() {
    // 初始化获取 env 依赖
    config({ allowEmptyValues: this.options.allowEmptyValues });
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
  get(path: string): any;
  get(getOptions?: Partial<GetOptions>): any;
  get(options: any) {
    if (typeof options === 'string') {
      options = { path: options };
    }
    const { path } = options || {};
    if (!path) {
      return this.env;
    }
    let _path = path;
    if (this.options.camelCase) {
      _path = path.split('.').map(camelCase).join('.');
    }
    return get(this.env, _path);
  }
}
export const DEFAULT_ENV_MANAGER = EnvManager.create();
