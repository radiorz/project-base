import { config } from 'dotenv-safe';
import { camelCase, get, set } from 'lodash';
config();
const DEFAULT_DELIMITER = '__';

export interface Options {
  // 层级的分隔符
  delimiter: string;
  // 是否将key 名称转化为 camelCase
  camelCase: boolean;
}
export interface GetOptions {
  path: string;
}
export class EnvManager {
  env: Record<string, any> = {};
  options: Options;
  constructor(options?: Partial<Options>) {
    this.options = Object.assign({ delimiter: DEFAULT_DELIMITER, camelCase: true }, options);
    this.init();
  }
  init() {
    for (const [key, value] of Object.entries(process.env)) {
      const keys = key.split(this.options.delimiter);
      let _key;
      if (this.options.camelCase) {
        _key = keys.map(camelCase).join('.');
      } else {
        _key = keys.join('.');
      }
      set(this.env, _key, value);
    }
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
export const DEFAULT_ENV_MANAGER = new EnvManager();
