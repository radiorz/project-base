// 存在一种可能就是我的配置从多个文件进行获取，每个文件就一个配置项，比如.node-version就只有node的版本，.date-version就只有日期版本，这样就可以避免配置文件的冲突问题

import { readLocalOrUrlFile } from '@tikkhun/utils';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
export interface LoadSingleTextOptions {
  key: string;
  trim: boolean;
}
export async function loadSingleText(filePath: string, options?: Partial<LoadSingleTextOptions>) {
  const { key = getKeyByFileName(filePath), trim = true } = options ?? {};
  let result = await readLocalOrUrlFile(filePath);
  if (trim) {
    result = (result as string)?.trim?.();
  }
  return { [key]: result };
}

export interface SaveSingleTextOptions {
  key: string;
}
export async function saveSingleText(
  config: Record<string, string>,
  filePath: string,
  options?: Partial<SaveSingleTextOptions>,
) {
  const { key = getKeyByFileName(filePath) } = options ?? {};
  if (config[key] === undefined) {
    throw new Error(`Key "${key}" not found in data`);
  }
  await writeFile(filePath, config[key]);
}

export function isDotFile(fileName: string) {
  return fileName.startsWith('.');
}
export function getKeyByFileName(filePath: string) {
  const fileName = path.basename(filePath, path.extname(filePath));
  return isDotFile(fileName) ? fileName.slice(1) : fileName;
}
