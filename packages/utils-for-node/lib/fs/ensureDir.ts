import fsExtra from 'fs-extra';
import { existsSync } from 'node:fs';
// 检查文件是否存在： fs.existsSync

/**
 * 确保某个目录存在
 * @param dir
 */
export async function ensureDir(dir: string) {
  // 文件夹不存在,就添加文件夹
  if (!existsSync(dir)) {
    await fsExtra.mkdir(dir, { recursive: true });
  }
}
