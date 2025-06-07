import { loadConfig } from '@tikkhun/config-loader';
import { createOverLoad } from '@tikkhun/overload';
import { mergeOptions } from '@tikkhun/utils-core';
import { join, basename } from 'path';
import { getInfoFromNestedObject } from './getInfoFromNestedObject';
import { Info } from './info.interface';
import { calculateMD5 } from '@tikkhun/utils';
import { stat } from 'fs/promises';

export const FileStat = 'FileStat';
export const loadInfo = createOverLoad({
  getType(arg: any, index: number) {
    // 定义一种特殊的类型，用于获取单文件信息
    if (index === 0 && arg === FileStat) {
      return FileStat;
    }
    return typeof arg;
  },
});
// 这里将读取他这个文件的配置
loadInfo.addImpl(FileStat, 'string', async (_: string, filePath: string) => {
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
