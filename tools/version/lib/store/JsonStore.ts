import { ConfigStore } from './ConfigStore';
import { StructuredVersionTarget } from './Store';

/**
 * @description JSON store 配置.
 */
export interface JsonStoreOptions {
  /**
   * @description 目标文件路径.
   */
  file: string;
  /**
   * @description 兼容旧版本的 key 配置.
   */
  key?: string;
  /**
   * @description 新版推荐的对象路径配置.
   */
  path?: string;
  /**
   * @description 文件不存在时是否允许创建.
   */
  createIfNotExists?: boolean;
}

/**
 * @description JSON store 默认配置.
 */
export const DEFAULT_JSON_STORE_OPTIONS: JsonStoreOptions = {
  file: 'package.json',
  key: 'version',
};

/**
 * @description JSON 版本 store.
 */
export class JsonStore extends ConfigStore {
  /**
   * @description 初始化 JSON store.
   * @param options store 配置.
   */
  constructor(options?: Partial<JsonStoreOptions>) {
    const mergedOptions = Object.assign({}, DEFAULT_JSON_STORE_OPTIONS, options);
    const target: StructuredVersionTarget = {
      type: 'json',
      file: mergedOptions.file,
      path: mergedOptions.path ?? mergedOptions.key,
      createIfNotExists: mergedOptions.createIfNotExists,
    };
    super(target);
  }
}
