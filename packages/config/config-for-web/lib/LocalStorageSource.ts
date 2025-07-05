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

import { type ConfigSource } from '@tikkhun/config-core';
import { mergeOptions } from '@tikkhun/utils-core';
import { debounce, set } from 'lodash-es';
export const LocalStorageSourceDefaultOptions = {
  // 存储的键值对
  key: 'config',
  // 存储的
  saveDebounce: 0,
  emitError: false,
  onSave: () => { },
};
export class LocalStorageSource implements ConfigSource {
  static defaultOptions = Object.freeze(LocalStorageSourceDefaultOptions);
  options: typeof LocalStorageSourceDefaultOptions;
  constructor(options?: Partial<typeof LocalStorageSourceDefaultOptions>) {
    this.options = mergeOptions(LocalStorageSource.defaultOptions, options);

    // FIXME saveDebounce 会影响同步性，可能会导致reset后config 依然加载旧参数，这个有待解决。
    if (this.options.saveDebounce) this.save = debounce(this.save.bind(this), this.options.saveDebounce);
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
      return;
    }
    this.save(path, undefined);
  }
  // 这里应该搞个debounce
  save(path: string, value: any) {
    // 由于是整份保存，所以只能这样当然可以debounce一下
    const config = this.load() || {};
    if (path === '') {
      localStorage.setItem(this.options.key, JSON.stringify(value));
      this.options.onSave();
      return;
    }
    set(config, path, value);
    localStorage.setItem(this.options.key, JSON.stringify(config));
    this.options.onSave();
  }
}
