import fsExtra from 'fs-extra';
const { readJson } = fsExtra;
import { packageJsonPath } from './path';
export async function getPackageJson() {
  return await readJson(packageJsonPath);
}
