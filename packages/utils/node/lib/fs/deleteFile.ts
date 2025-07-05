import { unlink } from 'fs/promises';

/**
 * 说明: 函数用于删除文件
 * @param filePath {String}
 * @returns
 * @example
 * deleteFile('./a.txt') //
 */
export function deleteFile(filePath: string): Promise<void> {
  return unlink(filePath);
}
