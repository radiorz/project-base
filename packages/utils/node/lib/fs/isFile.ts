import { stat as statAsync } from 'node:fs/promises';
// 检查文件是否存在： fs.existsSync

/**
 * @function isFile
 * @description 函数用于
 * @param
 * @returns
 * @example
 * isFile("index.js") // -> true
 * isFile("src") // -> false
 * isFile("asdf") // -> false
 */
export async function isFile(path: string) {
  try {
    const stat = await statAsync(path);
    return stat.isFile();
  } catch (error) {
    return false;
  }
}
