import fsExtra from 'fs-extra';
const { readJson } = fsExtra;
import { packageJsonPath } from './path.consts';
export async function getPackageJson() {
  return await readJson(packageJsonPath);
}
