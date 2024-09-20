import { Logger } from '@tikkhun/logger';
import fs, { readJsonSync } from 'fs-extra';
import { join } from 'path';

const logger = new Logger('utils');
// 确保文件夹
export async function ensureDir(dir: string) {
  // 文件夹不存在,就添加文件夹
  if (!fs.existsSync(dir)) {
    await fs.mkdir(dir, { recursive: true });
  }
}

export function getVersionFromPackageJson(workspace = process.cwd()): string {
  try {
    const json = readJsonSync(join(workspace, 'package.json'));
    return json.version;
  } catch (error: any) {
    logger.warn('从package.json获取版本错误: ' + error.message);
    return 'unknown';
  }
}
