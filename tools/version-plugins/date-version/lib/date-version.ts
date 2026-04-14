import { mergeOptions } from '@tikkhun/utils-core';
import dayjs from 'dayjs';

/**
 * @description 日期版本默认配置.
 */
export const DEFAULT_DATE_VERSION_GETTER_OPTIONS = {
  pattern: 'YYYY.M.D',
};

/**
 * @description 获取日期版本字符串.
 * @param options 日期格式配置.
 */
export function getDateVersion(options?: Partial<typeof DEFAULT_DATE_VERSION_GETTER_OPTIONS>) {
  const opts = mergeOptions(DEFAULT_DATE_VERSION_GETTER_OPTIONS, options);
  const version = dayjs().format(opts.pattern);
  return version;
}

/**
 * @description 去掉语义化版本里每段前导 0.
 * @param version 原始版本字符串.
 */
export function trimVersionStartZero(version: string) {
  const [majar, minor, patch] = version.split('.');
  const trimVersion = `${majar.replace(/^0+/, '')}.${minor.replace(/^0+/, '')}.${patch.replace(/^0+/, '')}`;
  return trimVersion;
}
