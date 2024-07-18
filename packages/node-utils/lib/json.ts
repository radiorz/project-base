import fsExtra from 'fs-extra';
import { packageJsonPath } from './path';
const { readJson } = fsExtra;
export async function getPackageJson() {
  return await readJson(packageJsonPath);
}
