import { stat, createReadStream, createWriteStream, unlink, existsSync } from 'node:fs';
import fsExtra from 'fs-extra';
/**
 * 说明: 检查文件是否存在
 * @param path 文件路径
 * @returns
 * @example
 * const result = await getFileStat("./a.txt") // -> boolean
 */
export async function checkPathExists(path: string): Promise<boolean> {
  return new Promise((resolve) => {
    stat(path, (err: any) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

/**
 * 说明: 拷贝文件
 * @param src 源地址
 * @param dist 目的地地址
 * @returns
 * @example
 * copy("./a.txt","./b.txt") // ->
 */
export function copy(src: string, dist: string) {
  return createReadStream(src).pipe(createWriteStream(dist));
}

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
