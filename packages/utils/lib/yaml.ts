import { readFileSync, writeFileSync } from 'fs';
import { load, dump } from 'js-yaml';
import { ensureFile, pathExists } from 'fs-extra';
export async function readYaml(filePath: string): Promise<Record<string, any> | unknown> {
  const isFilePathExist = await pathExists(filePath);
  if (!isFilePathExist) return;
  return load(readFileSync(filePath, 'utf8'));
}
export async function writeYaml(filePath: string, data: Record<string, any>) {
  let fileData = dump(data);
  await ensureFile(filePath);
  return writeFileSync(filePath, fileData, 'utf-8');
}
