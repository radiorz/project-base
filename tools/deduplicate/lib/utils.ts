import crypto from 'crypto';
import { readFile } from 'fs/promises';
export function calculateMD5(fileContent: any) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('md5');
    hash.update(fileContent);
    const md5 = hash.digest('hex');
    resolve(md5);
  });
}

export async function calculateFiles(filePath: string) {
  const file = await readFile(filePath);
  return await calculateMD5(file);
}
