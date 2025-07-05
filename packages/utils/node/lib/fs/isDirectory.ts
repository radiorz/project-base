import { stat as statAsync } from 'node:fs/promises';
// 检查文件是否存在： fs.existsSync

/**
 * @function isDirectory
 * @description 函数用于
 * @param {String} path 路径
 * @returns {Boolean}
 * @example
 * isDirectory("src") // -> true
 * isDirectory("index.js") // -> false
 * isDirectory("asdf") // ->false
 */
export async function isDirectory(path: string) {
  try {
    const stat = await statAsync(path);
    return stat.isDirectory();
  } catch (error) {
    return false;
  }
}
