import { loadConfig } from '@tikkhun/config-loader';
import { createOverLoad } from '@tikkhun/overload';
import { mergeOptions } from '@tikkhun/utils-core';
import { join } from 'path';
import { getInfoFromNestedObject } from './getInfoFromNestedObject';
import { Info } from './info.interface';

/**
 * @function getInfo
 * @description 合并多个info，并返回一个info对象
 * @param
 * @returns
 * @example
 * getInfo() // -> { name: 'tikkhun', ...}
 */
export interface GetInfoOptions {
  from: any[][];
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
  const infoSources: Info[] = await Promise.all(opts.from.map((fromOptions: any[]) => loadInfo(...fromOptions)));
  return mergeOptions(...infoSources); // 合并
}

export const loadInfo = createOverLoad();
loadInfo.addImpl('string', loadConfig);
loadInfo.addImpl('string', 'object', async (path: string, map: Record<string, string>) => {
  const config = await loadConfig(path);
  return getInfoFromNestedObject(config, map);
});
loadInfo.addImpl(
  'string',
  'string',
  'object',
  async (workspace: string, filePath: string, map: Record<string, string>) => {
    const config = await loadConfig(join(workspace, filePath));
    return getInfoFromNestedObject(config, map);
  },
);
loadInfo.addImpl('object', (value: Info) => value);
loadInfo.addImpl('object', 'object', getInfoFromNestedObject);
