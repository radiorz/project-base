import { get, merge, set } from 'lodash';
import { ConfigSource } from './ConfigSource';
export interface ConfigOptions {
  sources: ConfigSource[];
}

export interface GetOptions {
  path: string;
}
export interface SetOptions {
  path: string;
  data: any;
}
import { Emitter } from './Emitter';
export class Config extends Emitter {
  config: Record<string, any> = {};
  options: ConfigOptions;
  sources: ConfigSource[] = [];
  constructor(options: ConfigOptions) {
    super();
    this.options = options;
    this.sources = this.options.sources;
  }
  static create(options: ConfigOptions) {
    const configManager = new Config(options);
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
  set(setOptions?: Partial<SetOptions>) {
    const { path, data } = Object.assign({ path: '' }, setOptions);
    if (!path && !data) return;
    merge(this.config, set({}, path, data));
    this.emit('change', this.config); // 直接触发最新config比较直接。
  }
}
