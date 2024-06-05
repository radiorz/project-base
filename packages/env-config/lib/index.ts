import { config } from 'dotenv-safe';
import { get, set } from 'lodash';
config();
const DEFAULT_DELIMITER = '__';

export interface Options {
  delimiter: string;
}
export interface GetOptions {
  path: string;
}
export class EnvManager {
  env: Record<string, any> = {};
  options: Options;
  constructor(options?: Partial<Options>) {
    this.options = Object.assign({ delimiter: DEFAULT_DELIMITER }, options);
    this.init();
  }
  init() {
    for (const [key, value] of Object.entries(process.env)) {
      set(this.env, key.split(this.options.delimiter).join('.'), value);
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
    return get(this.env, path);
  }
}
export const DEFAULT_ENV_MANAGER = new EnvManager();
