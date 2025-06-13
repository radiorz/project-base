import { mergeOptions } from '@tikkhun/utils-core';
import { cloneDeep, get, set } from 'lodash-es';
import mitt, { Emitter } from 'mitt';
export interface Source {
  initialed?: boolean;
  load(): any;
  save?(path: string, value: any): void;
  reset?(): void;
  init?(): boolean;
}

export async function source(sources: Source[]) {
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
type OriginConfig = Record<string, any>;
const OriginConfigSymbol = Symbol('OriginConfig');
const EmitterSymbol = Symbol('Emitter');
interface Config extends Proxy {
  [OriginConfigSymbol]: OriginConfig;
  [EmitterSymbol]: Emitter<any>;
  get(path: string): any;
  set(path: string, value: any): void;
  reset(): void;
  watch(path: string, callback: (value: any) => void): void;
}

export function createConfig(config: OriginConfig): Config {
  const originConfig = cloneDeep(config);
  const proxy = new Proxy(config, {
    get(target, key) {
      if (key in target) {
        return Reflect.get(target, key);
      }
      return undefined;
    },
    set(target, key, value) {
      return Reflect.set(target, key, value);
    },
  });
  proxy[OriginConfigSymbol] = originConfig; // 这个合理么 为了 reset
  const emitter = mitt();
  proxy[EmitterSymbol] = emitter;
  proxy.get = function (path: string) {
    return get(this, path, undefined);
  };
  proxy.set = function (path: string, value: any) {
    this[EmitterSymbol].emit(path, value);
    return set(this, path, value);
  };
  // 搞个 dirtyValue
  proxy.reset = function (path: string) {
    return;
  };
  proxy.watch = function (path: string, callback: (value: any) => void) {
    return this[EmitterSymbol].on(path, callback);
  };
  return proxy as Config;
}
