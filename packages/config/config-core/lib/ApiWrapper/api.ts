import { ReactiveEmitter } from "../ReactiveEmitter/ReactiveEmitter";

export interface GetOptions {
  path: string;
}
export interface RemoveOptions {
  path: string;
}
export interface SetOptions {
  path: string;
  data: any;
}
export interface Api {
  get(path?: string): any;
  // get(options?: Partial<GetOptions>): any;

  set(path: string, data: any): any;
  // set(options?: Partial<SetOptions>): any;

  remove(path: string): any;
  // remove(options?: Partial<RemoveOptions>): any;

  reset(initialValues?: Record<string, any>): any;
}
import _ from 'lodash'
const { get, set } = _

export function wrapApi(reactiveEmitter: ReactiveEmitter) {
  return new ApiWrapper(reactiveEmitter)
}
export class ApiWrapper implements Api {
  constructor(public reactiveEmitter: ReactiveEmitter) { }
  get(path?: string) {
    if (!path) return this.reactiveEmitter.reactiveValue.value
    return get(this.reactiveEmitter.reactiveValue.value, path)
  }
  set(path: string = '', data: any) {
    if (!path) {
      return set(this.reactiveEmitter.reactiveValue, 'value', data || {}) // data一直保持一个对象形式
    }
    set(this.reactiveEmitter.reactiveValue.value, path, data)
  }
  remove(path?: string) {
    this.set(path, undefined)
  }
  reset(initialValues = {}) {
    this.reactiveEmitter.reactiveValue.value = initialValues
  }
  // 让外部去监听
  get on() {
    return this.reactiveEmitter.on.bind(this.reactiveEmitter)
  }
  // 配置的值
  get value() {
    return this.reactiveEmitter.reactiveValue.value
  }
}