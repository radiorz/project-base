import { createHash } from 'crypto';
import { readFileSync } from 'fs';
export function calculateMD5Sync(filePath: string) {
  // 创建一个md5 hash对象
  const hash = createHash('md5');
  // 同步读取文件内容并更新哈希
  const fileBuffer = readFileSync(filePath);
  hash.update(fileBuffer);
  // 计算 MD5 值
  const md5 = hash.digest('hex');
  return md5;
}
