import { existsSync } from "fs";
import { dirname, join } from "path";

/**
 * 获取指定文件夹的根路径
 * @param startDir 起始位置
 * @returns
 */
export function findNodeLibRootDir(startDir: string) {
    // 我们假设项目根目录下有一个 package.json 文件
    let dir = startDir;
    while (!existsSync(join(dir, 'package.json'))) {
        dir = dirname(dir);
        if (dir === dirname(dir)) {
            // 已经到达文件系统的根目录
            throw new Error('Could not find project root directory');
        }
    }
    return dir;
}
