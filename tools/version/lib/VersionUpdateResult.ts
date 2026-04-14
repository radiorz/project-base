import { StoreGetResult, StoreSetResult, StoreResult, VersionValue } from './store';

/**
 * @description store 聚合结果.
 */
export interface VersionManagerResult<T extends StoreResult = StoreResult> {
  /**
   * @description 当前操作是否全部成功.
   */
  success: boolean;
  /**
   * @description 本次操作处理的版本值.
   */
  value?: VersionValue;
  /**
   * @description 每个 store 的执行结果.
   */
  results: T[];
}

/**
 * @description 读取聚合结果.
 */
export type VersionReadResult = VersionManagerResult<StoreGetResult>;

/**
 * @description 写入聚合结果.
 */
export type VersionSetResult = VersionManagerResult<StoreSetResult>;

/**
 * @description 结果工厂.
 */
export class VersionUpdateResult {
  /**
   * @description 聚合多个 store 结果.
   * @param results store 结果列表.
   * @param value 当前版本值.
   */
  static create<T extends StoreResult>(results: T[], value?: VersionValue): VersionManagerResult<T> {
    return {
      success: results.every((result) => result.success),
      value,
      results,
    };
  }
}
