import { join } from 'path';

// 一种路径约定
export class PathResolver {
    constructor(
        public rootDir: string = process.cwd()
    ) {

    }
    // 获取root下的文件
    root(path: string) {

        return join(this.rootDir, path);
    }
    get dataDir() {
        return this.root('data');
    }
    get srcDir() {
        return this.root('src')
    }
    get packageJsonPath() {
        return this.root('pacakge.json')
    }
    data(path: string) {
        return join(this.dataDir, path);
    }
    src(dir: string) {
        return join(this.srcDir, dir);
    }
}

