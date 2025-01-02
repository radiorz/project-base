/**
 * @author
 * @file LocalStorageSource.ts
 * @fileBase LocalStorageSource
 * @path packages\config\lib\LocalStorageSource.ts
 * @from
 * @desc
 * @todo
 *
 *
 * @done
 * @example
 */

import { ConfigSource } from '@tikkhun/config-core';
import { optionsMerge } from '@tikkhun/utils-core';
import { debounce, merge, set } from 'lodash-es';
export const LocalStorageSourceDefaultOptions = {
  // 存储的键值对
  key: 'config',
  // 存储的
  saveDebounce: 200,
  emitError: false,
};
export class LocalStorageSource implements ConfigSource {
  static defaultOptions = Object.freeze(LocalStorageSourceDefaultOptions);
  options: typeof LocalStorageSourceDefaultOptions;
  constructor(options?: Partial<typeof LocalStorageSourceDefaultOptions>) {
    this.options = optionsMerge(LocalStorageSource.defaultOptions, options);
    this.save = debounce(this.save.bind(this), this.options.saveDebounce);
    this.save = debounce(this.save, 10);
  }
  load() {
    try {
      const config = localStorage.getItem(this.options.key);
      if (!config) {
        throw new Error('config is not defined');
      }
      return JSON.parse(config);
    } catch (error) {
      if (this.options.emitError) throw error;
      return null;
    }
  }
  reset(path?: string) {
    if (!path) {
      this.save('', {});
    }
  }
  // 这里应该搞个debounce
  save(path: string, value: any) {
    // 由于是整份保存，所以只能这样当然可以debounce一下
    const config = this.load() || {};
    set(config, path, value);
    localStorage.setItem(this.options.key, JSON.stringify(config));
  }
}
