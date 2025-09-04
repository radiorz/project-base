import { mergeOptions } from '@tikkhun/utils-core';
import { Info } from './info.interface';
import { loadInfo } from './loadInfo/loadInfo.utils';

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
  from: (any[] | { [props: string]: any[] })[];
}
export async function getInfo(options: GetInfoOptions): Promise<Info> {
  const opts = mergeOptions(
    {
      from: [],
    },
    options,
  );
  if (!opts.from.length) {
    return {};
  }
  const infoSources: Info[] = await Promise.all(
    opts.from.map(async (fromOptions: any[] | { [props: string]: any[] }) => {
      if (Array.isArray(fromOptions)) {
        return loadInfo(...fromOptions);
      }
      const keys = Object.keys(fromOptions);
      // 这里可以设置prefix
      const values: Record<string, Info> = {};
      for (const [key, options] of Object.entries(fromOptions)) {
        values[key] = await loadInfo(...options);
      }
      return values;
    }),
  );
  return mergeOptions(...infoSources); // 合并
}
