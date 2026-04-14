import { Logger } from '@tikkhun/logger';
import { Getter } from './getter';
import { JsonStore, Store, StoreFactory, VersionTarget, VersionValue } from './store';
import { VersionReadResult, VersionSetResult, VersionUpdateResult } from './VersionUpdateResult';
import { getDateVersion } from '@tikkhun/date-version';

/**
 * @description 版本管理器配置.
 */
export interface VersionManagerOptions {
  /**
   * @description 版本生成器.
   */
  getter: Getter;
  /**
   * @description 旧版 store 配置. 为兼容保留.
   */
  store: Store[] | Store;
  /**
   * @description 新版目标配置.
   */
  targets: VersionTarget[];
}

/**
 * @description 默认配置.
 */
export const DEFAULT_VERSION_MANAGER_OPTIONS: VersionManagerOptions = {
  getter: {
    get() {
      return getDateVersion();
    },
  },
  store: new JsonStore(),
  targets: [],
};

/**
 * @description 版本管理器.
 */
export class VersionManager {
  /**
   * @description 版本管理器配置.
   */
  opts: VersionManagerOptions;

  /**
   * @description 日志实例.
   */
  logger = new Logger('VersionManager');

  /**
   * @description 初始化版本管理器.
   * @param options 部分配置.
   */
  constructor(options?: Partial<VersionManagerOptions>) {
    this.opts = Object.assign({}, DEFAULT_VERSION_MANAGER_OPTIONS, options);
  }

  /**
   * @description 通过 getter 计算新版本值.
   */
  get() {
    return this.opts.getter.get();
  }

  /**
   * @description 从 store 读取当前版本值.
   */
  async read(): Promise<VersionReadResult> {
    const stores = this.resolveStores();
    const results = [] as Awaited<ReturnType<Store['get']>>[];
    for (const store of stores) {
      results.push(await store.get());
    }
    return VersionUpdateResult.create(results);
  }

  /**
   * @description 把指定版本值写入所有 store.
   * @param value 版本值.
   */
  async set(value: VersionValue): Promise<VersionSetResult> {
    this.logger.log('set version: ' + value);
    const stores = this.resolveStores();
    const results = [] as Awaited<ReturnType<Store['set']>>[];
    for (const store of stores) {
      results.push(await store.set(value));
    }
    return VersionUpdateResult.create(results, value);
  }

  /**
   * @description 先用 getter 获取新版本值, 再写入所有 store.
   */
  async update(): Promise<VersionSetResult> {
    const value = await this.get();
    this.logger.log('new version: ' + value);
    const stores = this.resolveStores();
    const results = [] as Awaited<ReturnType<Store['update']>>[];
    for (const store of stores) {
      results.push(await store.update(value));
    }
    return VersionUpdateResult.create(results, value);
  }

  /**
   * @description 解析最终生效的 store 列表.
   */
  protected resolveStores(): Store[] {
    if (this.opts.targets?.length) {
      return this.opts.targets.map((target) => StoreFactory.create(target));
    }
    return Array.isArray(this.opts.store) ? this.opts.store : [this.opts.store];
  }
}
