import { readdir, copyFile } from 'fs/promises';
import path from 'path';
/**
 * 
 * @param sourceFolder 
 * @param backupFolder 
 */
export async function backupFiles(sourceFolder: string, backupFolder: string) {
  const files = await readdir(sourceFolder);
  files.forEach(async (file) => {
    const sourcePath = path.join(sourceFolder, file);
    const backupPath = path.join(backupFolder, file);
    await copyFile(sourcePath, backupPath);
  });
}
