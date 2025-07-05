import { Emitter } from '@tikkhun/utils-core';
import { Api, ApiWrapper, wrapApi } from "./ApiWrapper";
import { createReactiveEmitter, ReactiveEmitter } from "./ReactiveEmitter";
import { Source, SourceManager } from "./source";

export const DefaultConfigOptions = {
  sources: [] as Source[],
  global: undefined as string | undefined,
  autoSync: false,
  allowSyncError: false,
}

export type ConfigOptions = typeof DefaultConfigOptions & {
  sources: Source[];
  global?: string;
};

export class Config extends Emitter implements Api {
  options: ConfigOptions;
  sourceManager: SourceManager;
  reactiveEmitter: ReactiveEmitter;
  api: ApiWrapper;
  inited = false;
  loaded = false;
  constructor(options: Partial<ConfigOptions>) {
    super();
    this.options = { ...DefaultConfigOptions, ...options };
    this.sourceManager = new SourceManager(this.options.sources);
    this.reactiveEmitter = createReactiveEmitter({});
    this.api = wrapApi(this.reactiveEmitter);
    if (this.options.global) {
      (globalThis as any)[this.options.global] = this;
    }
  }

  static async create(options: Partial<ConfigOptions>): Promise<Config> {
    const config = new Config(options);
    await config.init();
    await config.load();
    return config;
  }

  async init(): Promise<void[]> {
    const results = await this.sourceManager.init();
    this.inited = true;
    this.emit('inited', this);
    return results;
  }

  async load(): Promise<any> {
    if (!this.inited) {
      throw new Error('请先初始化');
    }
    const configValue = await this.sourceManager.load();
    this.reactiveEmitter.reactiveValue.value = configValue;
    this.loaded = true;
    // ready
    this.emit('ready', this)
    // 事件
    this.api.on('change', (options) => {
      if (this.options.autoSync) {
        try {
          this.sourceManager.sync(options.path, options.value)
        } catch (error: any) {
          console.error('同步，但错误: ', error?.message)
        }
      }
      this.emit('change', options)
    })
  }

  async sync(path: string, value: any): Promise<void[]> {
    return Promise.all(
      this.sourceManager.sources.map(source =>
        source.save?.(path, value) ?? Promise.resolve()
      )
    );
  }

  async addSource(source: Source): Promise<boolean> {
    if (this.sourceManager.sources.includes(source)) return true;
    if (source.init) await source.init();
    const sourceConfig = await source.load();
    this.set('', { ...this.value, ...sourceConfig });
    this.sourceManager.addSource(source);
    return true;
  }

  removeSource(source: Source): void {
    this.sourceManager.removeSource(source);
  }

  get(path?: string): any {
    return this.api.get(path);
  }

  set(path: string, data: any): any {
    return this.api.set(path, data);
  }

  remove(path?: string): any {
    return this.api.remove(path);
  }

  async reset(): Promise<void> {
    await Promise.all(
      this.sourceManager.sources.map(source => source.reset?.() ?? Promise.resolve())
    );
    await this.load();
  }

  get value(): any {
    return this.reactiveEmitter.reactiveValue.value;
  }

}