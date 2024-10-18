import { Logger } from '@tikkhun/logger';
import fsExtra from 'fs-extra';
const { readJsonSync, existsSync, mkdir } = fsExtra;
import { join } from 'path';
import _ from 'lodash';

const logger = new Logger('utils');
// 确保文件夹
export async function ensureDir(dir: string) {
  // 文件夹不存在,就添加文件夹
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}
export function getPackageJson(workspace = process.cwd()): Record<string, any> | null {
  try {
    return readJsonSync(join(workspace, 'package.json'));
  } catch (error: any) {
    logger.warn('读取package.json错误: ' + error?.message);
    return null;
  }
}
export function getVersionFromPackageJson(workspace = process.cwd()): string {
  try {
    const json = readJsonSync(join(workspace, 'package.json'));
    return json.version;
  } catch (error: any) {
    logger.warn('从package.json获取版本错误: ' + error?.message);
    return 'unknown';
  }
}
export function getNameFromPackageJson(workspace = process.cwd()): string {
  try {
    const json = readJsonSync(join(workspace, 'package.json'));
    return json.version;
  } catch (error: any) {
    logger.warn('从package.json获取版本错误: ' + error?.message);
    return 'project';
  }
}

export function getLastSegment(mixedPath: string) {
  // 正则表达式匹配 / 或 \ 分隔的路径
  const regex = /([^\/\\]+)$/;
  const match = mixedPath.match(regex);

  // 返回匹配到的最后一个路径组件
  return match ? match[1] : null;
}

