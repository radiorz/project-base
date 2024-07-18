import { join } from 'path';
export const rootDir = process.cwd();
export const packageJsonPath = join(rootDir, 'package.json');
export const dataDir = join(rootDir, 'data');
export const srcDir = join(rootDir, 'src');
export class PathResolver {
  root(dir: string) {
    return join(rootDir, dir);
  }
  data(dir: string) {
    return join(dataDir, dir);
  }
  src(dir: string) {
    return join(srcDir, dir);
  }
}
