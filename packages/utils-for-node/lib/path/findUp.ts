import * as path from 'path';
import * as fs from 'fs';

/**
 * 向上查找指定文件名的文件，支持指定向上查找的层级
 * @param filename 要查找的文件名
 * @param dir 起始查找目录，默认为当前工作目录
 * @param maxDepth 最大查找层级，默认为无限（-1）
 * @returns 找到的文件的完整路径，如果未找到则返回 null
 */
export function findUp(filename: string, dir: string = process.cwd(), maxDepth: number = -1): string | null {
    let currentDir = path.resolve(dir);
    let depth = 0;

    while (true) {
        const filePath = path.join(currentDir, filename);
        if (fs.existsSync(filePath)) {
            return filePath;
        }

        if (maxDepth !== -1 && depth >= maxDepth) {
            return null;
        }

        const parentDir = path.dirname(currentDir);
        if (parentDir === currentDir) {
            // 已经到达根目录
            return null;
        }

        currentDir = parentDir;
        depth++;
    }
}

export default findUp;
