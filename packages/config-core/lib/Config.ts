import { get, merge, set } from 'lodash';
import { ConfigSource } from './ConfigSource';
import { Emitter } from './Emitter';
import type { Api, GetOptions, RemoveOptions, SetOptions } from './Api';
export interface ConfigOptions {
  sources: ConfigSource[];
}

export class Config extends Emitter implements Api {
  _config: Record<string, any> = {};
  options: ConfigOptions;
  sources: ConfigSource[] = [];
  get config() {
    return this._config;
  }
  set config(value) {
    this._config = value;
    this.emit('change', this._config);
  }
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
    this.config = merge({}, ...results);
  }
  addSource(source: ConfigSource) {
    this.sources.push(source);
    if (source.init) source.init();
    this.config = merge(this.config, source?.load());
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
  set(path: string, data: any): any;
  set(setOptions?: Partial<SetOptions>): any;
  set(first?: string | Partial<SetOptions>, second?: any) {
    let opts: any = {};
    if (typeof first === 'string') {
      opts = { path: first, data: second };
    } else {
      opts = first;
    }

    const { path, data } = Object.assign({ path: '', data: undefined }, opts);
    if (!path && !data) return;
    // 这里直接赋值使得每次变化都能被set 函数监听到并触发
    this.config = set(this.config, path, data);
    // TODO 设置回去
    this.sources.forEach((source) => {
      source.save?.(this.config);
    });
  }
  // 重置整个config
  reset() {
    // 重新加载即可
    this.load();
  }
  remove(path: string): any;
  remove(options?: Partial<RemoveOptions>): any;
  remove(first?: string | Partial<RemoveOptions>) {
    if (typeof first === 'string') {
      return this.set(first, undefined);
    } else {
      return this.set({ ...first, data: undefined });
    }
  }
}
