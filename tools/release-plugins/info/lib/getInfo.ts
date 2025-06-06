import { loadConfig } from '@tikkhun/config-loader';
import { createOverLoad } from '@tikkhun/overload';
import { mergeOptions } from '@tikkhun/utils-core';
import { join, basename } from 'path';
import { getInfoFromNestedObject } from './getInfoFromNestedObject';
import { Info } from './info.interface';
import { calculateMD5 } from '@tikkhun/utils';
import { stat } from 'fs/promises';

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
const FileInfo = 'FileInfo';
export const loadInfo = createOverLoad({
  getType(arg: any, index: number) {
    // 定义一种特殊的类型，用于获取单文件信息
    if (index === 0 && arg === FileInfo) {
      return FileInfo;
    }
    return typeof arg;
  },
});
// 这里将读取他这个文件的配置
loadInfo.addImpl(FileInfo, 'string', async (_: string, filePath: string) => {
  const fileStat = await stat(filePath);
  const config = {
    mainFilePath: filePath,
    mainFileName: basename(filePath),
    fileSize: fileStat.size,
    fileMd5: await calculateMD5(filePath),
  };
  return config;
});
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
