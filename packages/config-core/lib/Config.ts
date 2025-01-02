import { Emitter } from '@tikkhun/utils-core';
import { debounce, get, merge, set, throttle } from 'lodash';
import type { Api, GetOptions, RemoveOptions, SetOptions } from './Api';
import { ConfigSource } from './ConfigSource';
import { createReactiveObject } from './reactive';
export interface ConfigOptions {
  /**
   * 获取来源
   */
  sources: ConfigSource[];
  /**
   * 全局变量名称
   */
  global?: string;
  // store?: ConfigStorage; // store 永远是内存store 不过 source 可以save 也就是可以同步我们的更改。
}
export enum ConfigEvents {
  change = 'change', // 整体改变了
  valueChange = 'valueChange', // 某个值改变了
}
export class Config extends Emitter implements Api {
  options: ConfigOptions;
  sources: ConfigSource[] = [];
  // 由于可能会将value完全清空 所以还是多嵌套一层，让监听使用者不需要重新创建 new Proxy对象
  _config = createReactiveObject<{ value: any }>(
    {
      value: {},
    },
    this.handleValueChange.bind(this),
  );
  get config() {
    return this._config.value;
  }
  set config(value: any) {
    this._config.value = value;
  }
  handleValueChange(path: string, value: any) {
    console.log(`111 path,value`, path, value);
    const theTruePath = path.replace(/value\.?/, '');
    this.syncToSources(theTruePath, value);
    this.emit(ConfigEvents.valueChange, { path: theTruePath, value });
    // 这里会不断触发，知道 超出debounce时间（不过这样有一定的延迟，或许让业务直接监听valueChange 会更好）
    this.handleWholeChange();
  }
  // 有时候不要频繁变更 所以加个debounce 只监听最后一次抖动
  handleWholeChange() {
    this.emit(ConfigEvents.change, this.config);
  }
  constructor(options: ConfigOptions) {
    super();
    this.options = options;
    this.sources = this.options.sources;
    // 设置到全局
    if (this.options.global) {
      (globalThis as any)[this.options.global] = this;
    }
    // 修改多次最终只会触发一次
    this.handleWholeChange = debounce(this.handleWholeChange, 100);
  }
  static create(options: ConfigOptions) {
    const configManager = new Config(options);
    configManager.init();
    configManager.load();
    return configManager;
  }
  syncToSources(path: string, value: any) {
    // 同步到源上,源采取全修改的方式PUT
    this.sources.forEach((source) => {
      source.save?.(path, value);
    });
  }

  init() {
    // 目前都是同步.
    this.sources.forEach((source) => {
      if (source.init) source.init();
    });
  }
  load() {
    // 目前都是同步
    const results = this.sources.map((source) => source.load());
    // 合并各个数据
    const originConfig = merge({}, ...results);
    // 使用Proxy来监听config的变化
    this.config = originConfig;
  }

  addSource(source: ConfigSource) {
    if (source.init) source.init();
    // this.config 不能直接等于
    const sourceConfig = source?.load();
    // 或者重新全部load也可以 不过这样开销比较大
    this.config = merge({}, this.config, sourceConfig);
    this.sources.push(source);
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
      // 重置整个配置
      this.config = {}; // 清空配置
      return;
    }
    if (typeof data === 'undefined') return;
    // 这里直接赋值使得每次变化都能被set 函数监听到并触发
    this.config = set(this.config, path, data);
  }
  // 删除某部分
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
  // 重置整个config
  reset(source = false) {
    // 清空所有，然后重新加载
    // 清空所有 正常是直接load就行，但有种情况就是又是store 又是source 如果不清空就白重新加载。
    if (source) {
      this.sources.forEach((source) => {
        source.reset?.();
      });
    }
    // 重新加载
    this.load();
  }
}
