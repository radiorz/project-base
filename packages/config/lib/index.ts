import { mergeOptions } from '@tikkhun/utils-core';
import { get, set } from 'lodash-es';
import mitt, { Emitter, Handler, WildcardHandler } from 'mitt';
import { createReactiveObject } from './reactive';
export interface Source {
  initialed?: boolean;
  load(): any;
  save?(path: string, value: any): void;
  reset?(): void;
  init?(): boolean;
}
export type OriginConfig = Record<string, any>;

export async function source(sources: Source[]): Promise<OriginConfig> {
  // 获取配置
  const results = await Promise.all(
    sources
      .filter((source) => source.init && source.initialed && source.load) // 初始化已经完成才能source
      .map((source) => {
        return source.load();
      }),
  );

  return mergeOptions(...results);
}

interface ConfigApi {
  get(path: string): any;
  set(path: string, value: any): void;
  reset(): void;
  watch<Events = string>(path: string, handler: Handler<Events>): void;
  watch(path: '*', handler: WildcardHandler<any>): void;
}
const DefaultCreateConfigOptions = {
  couldReset: false,
};
export class ConfigProxy implements ConfigApi {
  // private dirtyValues?: OriginConfig;
  private emitter = mitt();
  private _value: any;
  get value() {
    return this._value.value; // 多加一层是为了确保监听的有效性
  }
  set value(value) {
    this._value.value = value;
  }

  constructor(target: OriginConfig) {
    this._value = createReactiveObject({ value: target }, (path: string, value: any, oldValue: any) =>
      this.emitter.emit(path, {
        value,
        oldValue,
      }),
    );
  }
  get(path: string) {
    return get(this.value, path, undefined);
  }
  set(path: string, value: any) {
    set(this.value, path, value);
  }
  reset(): void {
    throw new Error('Method not implemented.');
  }
  watch(path: string, callback: any) {
    return this.emitter.on(path, callback);
  }
}
export function createConfig(
  config: OriginConfig,
  options: Partial<typeof DefaultCreateConfigOptions> = DefaultCreateConfigOptions,
) {
  options = mergeOptions(DefaultCreateConfigOptions, options) as typeof DefaultCreateConfigOptions;
  const proxy = new ConfigProxy(config);
  return proxy;
}
