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
import { Getter, DateVersionGetter } from './getter';
import { JsonStore, Store } from './store';
export interface VersionManagerOptions {
  getter: Getter;
  store: Store[] | Store;
}
export const DEFAULT_VERSION_MANAGER_OPTIONS: VersionManagerOptions = {
  getter: new DateVersionGetter(),
  store: new JsonStore(),
};
export class VersionManager {
  opts: VersionManagerOptions;
  constructor(options?: Partial<VersionManagerOptions>) {
    this.opts = Object.assign(DEFAULT_VERSION_MANAGER_OPTIONS, options);
  }
  get() {
    return this.opts.getter.get();
  }
  async update() {
    const value = this.get();
    const stores = Array.isArray(this.opts.store) ? this.opts.store : [this.opts.store];
    for (const store of stores) {
      await store.update(value);
    }
  }
}
