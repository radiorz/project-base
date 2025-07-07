/**
 * @author
 * @file VersionManager.ts
 * @fileBase VersionManager
 * @path tools\date-version\lib\VersionManager.ts
 * @from
 * @desc
 * @todo
 *
 *
 * @done
 * @example
 */
import { Logger } from '@tikkhun/logger';
import { Getter } from './getter';
import { JsonStore, Store } from './store';
import { getDateVersion } from '@tikkhun/date-version';
export interface VersionManagerOptions {
  getter: Getter;
  store: Store[] | Store;
}
export const DEFAULT_VERSION_MANAGER_OPTIONS: VersionManagerOptions = {
  getter: {
    get() {
      return getDateVersion();
    },
  },
  store: new JsonStore(),
};
export class VersionManager {
  opts: VersionManagerOptions;
  logger = new Logger('VersionManager');
  constructor(options?: Partial<VersionManagerOptions>) {
    this.opts = Object.assign({}, DEFAULT_VERSION_MANAGER_OPTIONS, options);
  }
  // 获取
  get() {
    return this.opts.getter.get();
  }
  async update() {
    // 获取
    const value = await this.get();
    this.logger.log('new version: ' + value);
    // 保存
    const stores = Array.isArray(this.opts.store) ? this.opts.store : [this.opts.store];
    try {
      const results = await Promise.all(stores.map((store) => store.update(value)));
      if (results.filter((r) => !r).length) {
        throw new Error(`update, but error`);
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}
