import { mergeOptions } from '@tikkhun/utils-core';
import { Info } from './info.interface';
import { loadInfo } from './loadInfo/loadInfo.utils';
import { getInfoFromNestedObject } from './utils';
export type LoadInfoArgs = any[];
export interface FromObject {
  prefix?: string;
  args: LoadInfoArgs;
  map?: Record<string, string>; // 这个map用于过滤对象,这样获取之后不会有冗余的信息
}
export type From = LoadInfoArgs | FromObject;
/**
 * @function getInfo
 * @description 合并多个info，并返回一个info对象
 * @param
 * @returns
 * @example
 * getInfo() // -> { name: 'tikkhun', ...}
 */
export interface GetInfoOptions {
  // 可以添加前缀
  from: From[];
  debug?: boolean;
  ignoreError?: boolean; // 是否忽略错误
}
export async function getInfo(options: GetInfoOptions): Promise<Info> {
  const opts = mergeOptions(
    {
      from: [],
      debug: false,
      ignoreError: true,
    },
    options,
  ) as GetInfoOptions;
  if (!opts.from?.length) {
    if (options.debug) {
      console.debug(`from is empty`);
    }
    return {};
  }

  const infoSources = await Promise.all(
    opts.from.filter(isObject).map(normalizeFromOptions).map(async (fromOptions) => {
      try {
        const { prefix, args, map } = fromOptions || {};
        // 没有参数就直接返回null
        if (!args?.length) {
          return null;
        }
        // @ts-ignore
        const originInfo = await loadInfo(...args);
        return transInfo(originInfo, { prefix, map });
      } catch (error) {
        if (opts.ignoreError) {
          console.error('获取信息失败,但被忽略:', error);
          return {};
        }
        throw error;
      }
    }),
  );
  return mergeOptions(...infoSources); // 合并
}
export function isObject(v: any) {
  return typeof v === 'object';
}
/**
 * @function normalizeFromOptions
 * @description 归一化from选项,如果是数组,则转换为对象
 * @param options
 * @returns
 */
export function normalizeFromOptions(options: From | FromObject): FromObject {
  if (Array.isArray(options)) {
    return {
      args: options,
    }
  }
  return options;
}
export function transInfo(origin: any, { prefix, map }: { prefix?: string, map?: Record<string, string> }) {
  const mappedInfo = getInfoFromNestedObject(origin, map);
  if (prefix) {
    return { [prefix]: mappedInfo };
  }
  return mappedInfo;
}
