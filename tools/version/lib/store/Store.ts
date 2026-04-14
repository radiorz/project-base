/**
 * @description 版本值类型.
 */
export type VersionValue = string | number;

/**
 * @description 结构化文件类型.
 */
export type StructuredVersionTargetType = 'json' | 'yaml' | 'toml' | 'xml' | 'env';

/**
 * @description 文本文件更新模式.
 */
export type TextStoreMode = 'raw' | 'replace';

/**
 * @description 版本目标基础配置.
 */
export interface BaseVersionTarget {
  /**
   * @description 目标文件路径.
   */
  file: string;
  /**
   * @description 文件编码.
   */
  encoding?: BufferEncoding;
  /**
   * @description 文件不存在时是否允许创建.
   */
  createIfNotExists?: boolean;
}

/**
 * @description 结构化配置文件目标.
 */
export interface StructuredVersionTarget extends BaseVersionTarget {
  /**
   * @description 目标文件类型.
   */
  type: StructuredVersionTargetType;
  /**
   * @description 配置路径. 例如 version 或 build.app.version.
   */
  path?: string;
}

/**
 * @description 文本文件目标.
 */
export interface TextVersionTarget extends BaseVersionTarget {
  /**
   * @description 文本存储类型.
   */
  type: 'text';
  /**
   * @description 文本更新模式.
   */
  mode?: TextStoreMode;
  /**
   * @description 读取文本时是否需要 trim.
   */
  trim?: boolean;
  /**
   * @description 替换模式的正则表达式.
   */
  pattern?: string;
  /**
   * @description 替换模式的正则标记.
   */
  flags?: string;
  /**
   * @description 替换模板. 支持 {{version}} 占位符.
   */
  replacement?: string;
}

/**
 * @description 自定义目标配置.
 */
export interface CustomVersionTarget extends BaseVersionTarget {
  /**
   * @description 自定义类型.
   */
  type: 'custom';
  /**
   * @description 自定义读取函数.
   * @param file 文件路径.
   */
  get?: (file: string) => Promise<VersionValue> | VersionValue;
  /**
   * @description 自定义写入函数.
   * @param value 版本值.
   * @param file 文件路径.
   */
  set?: (value: VersionValue, file: string) => Promise<void> | void;
}

/**
 * @description 支持的版本目标.
 */
export type VersionTarget = StructuredVersionTarget | TextVersionTarget | CustomVersionTarget;

/**
 * @description store 读取结果.
 */
export interface StoreGetResult {
  /**
   * @description 操作名称.
   */
  action: 'get';
  /**
   * @description 是否成功.
   */
  success: boolean;
  /**
   * @description 目标文件路径.
   */
  file: string;
  /**
   * @description 目标文件类型.
   */
  type: VersionTarget['type'];
  /**
   * @description 当前读取到的值.
   */
  value?: VersionValue;
  /**
   * @description 附加消息.
   */
  message?: string;
}

/**
 * @description store 写入结果.
 */
export interface StoreSetResult {
  /**
   * @description 操作名称.
   */
  action: 'set' | 'update';
  /**
   * @description 是否成功.
   */
  success: boolean;
  /**
   * @description 目标文件路径.
   */
  file: string;
  /**
   * @description 目标文件类型.
   */
  type: VersionTarget['type'];
  /**
   * @description 写入前的旧值.
   */
  oldValue?: VersionValue;
  /**
   * @description 写入后的新值.
   */
  newValue?: VersionValue;
  /**
   * @description 附加消息.
   */
  message?: string;
}

/**
 * @description store 操作结果.
 */
export type StoreResult = StoreGetResult | StoreSetResult;

/**
 * @description store 接口. 负责从目标文件读取和写入版本.
 */
export interface Store {
  /**
   * @description 绑定的目标配置.
   */
  target: VersionTarget;
  /**
   * @description 读取当前版本值.
   */
  get(): Promise<StoreGetResult> | StoreGetResult;
  /**
   * @description 直接写入版本值.
   * @param value 版本值.
   */
  set(value: VersionValue): Promise<StoreSetResult> | StoreSetResult;
  /**
   * @description 更新版本值. 语义上等同 set, 但保留给 CLI 和日志使用.
   * @param value 版本值.
   */
  update(value: VersionValue): Promise<StoreSetResult> | StoreSetResult;
}
