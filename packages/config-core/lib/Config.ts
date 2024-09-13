import { get, merge, set } from 'lodash';
import { ConfigSource } from './ConfigSource';
import { Emitter } from './Emitter';
import type { Api, GetOptions, RemoveOptions, SetOptions } from './Api';
import { ConfigStorage, MemoryStorage } from './ConfigStorage';
export interface ConfigOptions {
  /**
   * 获取来源
   */
  sources: ConfigSource[];
  /**
   * 全局变量名称
   */
  global?: string;
  store?: ConfigStorage;
}

export class Config extends Emitter implements Api {
  options: ConfigOptions;
  sources: ConfigSource[] = [];
  store: ConfigStorage;
  get config() {
    return this.store.get();
  }
  set config(value) {
    this.store.set(value);
    this.emit('change', this.config);
  }
  constructor(options: ConfigOptions) {
    super();
    this.options = options;
    this.sources = this.options.sources;
    this.store = this.options.store || new MemoryStorage();
    this.on('change', (config) => {
      // 同步到源上
      this.sources.forEach((source) => {
        source.save?.(config);
      });
    });
    // 设置到全局
    if (this.options.global) {
      (globalThis as any)[this.options.global] = this;
    }
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
    this.config = merge({}, this.config, source?.load());
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
    if (path === '') {
      return (this.config = {}); // 清空配置
    }
    if (typeof data === 'undefined') return;
    // 这里直接赋值使得每次变化都能被set 函数监听到并触发
    this.config = set(this.config, path, data);
  }
  // 重置整个config
  reset() {
    // 清空所有，然后重新加载
    // 清空所有 正常是直接load就行，但有种情况就是又是store 又是source 如果不清空就白重新加载。
    this.remove();
    // 重新加载
    this.load();
  }
  remove(path: string): any;
  remove(options?: Partial<RemoveOptions>): any;
  remove(first?: string | Partial<RemoveOptions>) {
    // 完全清空
    if (!first) {
      return this.set('', null);
    }
    if (typeof first === 'string') {
      return this.set(first, null);
    }
    return this.set({ ...first, data: null });
  }
}
