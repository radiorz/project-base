import fsExtra from 'fs-extra';
import { existsSync, unlink } from 'node:fs';
import { stat as statAsync } from 'node:fs/promises';
// 检查文件是否存在： fs.existsSync
/**
 * 说明: 函数用于删除文件
 * @param filePath {String}
 * @returns
 * @example
 * deleteFile('./a.txt') //
 */
export function deleteFile(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    unlink(filePath, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
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
