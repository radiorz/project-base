import { loadConfig } from '@tikkhun/config-loader';
import { createOverLoad } from '@tikkhun/overload';
import { calculateMD5, isFile } from '@tikkhun/utils';
import { stat } from 'fs/promises';
import { basename, join } from 'path';
import { Info } from '../info.interface';

export const __FILE_STAT__ = '__FILE_STAT__';
/** 
 * @deprecated use __FILE_STAT__ instead
 */
export const FileStat = __FILE_STAT__
export const loadInfo = createOverLoad({
  getType(arg: any, index: number) {
    // 定义一种特殊的类型，用于获取单文件信息
    if (index === 0 && arg === __FILE_STAT__) {
      return __FILE_STAT__;
    }
    return typeof arg;
  },
});
export function loadStatFromPath(_path: string) {
  return stat(_path);
}
// 读取文件信息
loadInfo.addImpl(__FILE_STAT__, 'string', async (_: string, filePath: string) => {
  const fileStat = await stat(filePath);
  const config: any = {
    ...fileStat,
    filePath: filePath,
    fileName: basename(filePath),
  };
  // 只有 file 才计算 md5
  if (await isFile(filePath)) {
    config.fileMd5 = await calculateMD5(filePath)
  }
  return config;
});
// 通过文件路径读取配置文件
loadInfo.addImpl('string', loadConfig);
loadInfo.addImpl(
  'string',
  'string',
  async (workspace: string, filePath: string) => {
    return await loadConfig(join(workspace, filePath));
  },
);
// 通过输入 info 对象
loadInfo.addImpl('object', (value: Info) => value);
