import fsExtra from 'fs-extra';
import { join } from 'path';
import { findNodeLibRootDir } from './path';
const { readJson } = fsExtra;
export async function getPackageJson() {
  return await readJson(join(findNodeLibRootDir(process.cwd()), 'package.json'));
}
