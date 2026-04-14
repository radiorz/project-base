/**
 * StorageAdapter 存储适配器接口.
 * 设计原因: 为 Host 的配置持久化提供统一抽象,上层可以替换内存,文件,数据库等实现而不改业务代码.
 */
export interface StorageAdapter {
  /**
   * 读取存储值.
   * @param key 存储键.
   * 设计原因: 兼容同步与异步实现,便于在内存,文件,数据库等介质间切换.
   */
  get<T = any>(key: string): Promise<T | undefined> | T | undefined;
  /**
   * 写入存储值.
   * @param key 存储键.
   * @param value 存储值.
   */
  set<T = any>(key: string, value: T): Promise<void> | void;
  /**
   * 删除存储值.
   * @param key 存储键.
   */
  remove(key: string): Promise<void> | void;
  /**
   * 清空存储.
   * 设计原因: 对部分存储介质是可选能力,因此定义为可选.
   */
  clear?(): Promise<void> | void;
}

/**
 * 基于 Map 的内存存储实现.
 * 设计原因: 默认实现零依赖,适合本地运行与测试场景,也便于用户替换为持久化存储.
 */
export class MemoryStorage implements StorageAdapter {
  /**
   * store 内存键值表.
   * 设计原因: 用 Map 保持键的精确语义,避免对象原型链与 key 冲突问题.
   */
  private store = new Map<string, any>();

  /**
   * @param key 存储键.
   */
  get<T = any>(key: string): T | undefined {
    return this.store.get(key);
  }

  /**
   * @param key 存储键.
   * @param value 存储值.
   */
  set<T = any>(key: string, value: T): void {
    this.store.set(key, value);
  }

  /**
   * @param key 存储键.
   */
  remove(key: string): void {
    this.store.delete(key);
  }

  /**
   * 清空内存存储.
   */
  clear(): void {
    this.store.clear();
  }
}
