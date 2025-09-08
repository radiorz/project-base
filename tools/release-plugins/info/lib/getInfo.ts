import { mergeOptions } from '@tikkhun/utils-core';
import { Info } from './info.interface';
import { loadInfo } from './loadInfo/loadInfo.utils';
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
}
export async function getInfo(options: GetInfoOptions): Promise<Info> {
  const opts = mergeOptions(
    {
      from: [],
      debug: false,
    },
    options,
  ) as GetInfoOptions;
  if (!opts.from.length) {
    if (options.debug) {
      console.debug(`from is empty`);
    }
    return {};
  }
  const infoSources: Info[] = await Promise.all(
    opts.from.map(async (fromOptions) => {
      // 要么 数组 要么 对象
      if (typeof fromOptions !== 'object') {
        return null;
      }
      if (Array.isArray(fromOptions)) {
        return loadInfo(...fromOptions);
      }
      const { prefix, args, map } = fromOptions || {};
      // 没有参数就直接返回null
      if (!args?.length) {
        return null;
      }
      const originInfo = await loadInfo(...args);
      const mappedInfo = isEmpty(map) ? originInfo : getMappedInfo(originInfo, map!);
      // 这里可以设置prefix
      const values = prefix ? { [prefix]: mappedInfo } : mappedInfo;
      return values;
    }),
  );
  return mergeOptions(...infoSources); // 合并
}

export function getMappedInfo(data: any, map: Record<string, string>) {
  // 数据不是data
  if (typeof data !== 'object') {
    return data;
  }
  const mappedInfo: Record<string, any> = {};
  for (const [key, value] of Object.entries(map)) {
    mappedInfo[key] = data[value];
  }
  return mappedInfo;
}
export function isEmpty(obj: any) {
  if (!obj) {
    return true;
  }
  return Object.keys(obj).length === 0;
}
