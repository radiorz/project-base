/// <reference types="node" />
import fs from "node:fs";
/**
 * 说明: 检查文件是否存在
 * @param path 文件路径
 * @returns
 * @example
 * const result = await getFileStat("./a.txt") // ->
 */
export declare function checkPathExists(path: string): Promise<boolean>;
/**
 * 说明: 拷贝文件
 * @param src 源地址
 * @param dist 目的地地址
 * @returns
 * @example
 * copy("./a.txt","./b.txt") // ->
 */
export declare function copy(src: string, dist: string): fs.WriteStream;
//# sourceMappingURL=file.d.ts.map