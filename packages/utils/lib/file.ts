import fs from "node:fs";

/**
 * 说明: 检查文件是否存在
 * @param filePath 文件路径
 * @returns 
 * @example
 * const result = await getFileStat("./a.txt") // -> 
 */
export async function getFileStat(filePath: string) {
  return new Promise((resolve) => {
    fs.stat(filePath, (err: any, stats: any) => {
      if (err) {
        resolve(false);
      } else {
        resolve(stats);
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
  return fs.createReadStream(src).pipe(fs.createWriteStream(dist));
}
