import { readJson } from 'fs-extra';
import { packageJsonPath } from './path.consts';
export async function getPackageJson() {
  return await readJson(packageJsonPath);
}
