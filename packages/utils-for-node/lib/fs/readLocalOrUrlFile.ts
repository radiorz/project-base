import { readFile as readLocalFile } from 'node:fs/promises';
import { isUrlString } from 'url-or-path';

/**
 * @param {string | URL} file
 * @returns {Promise<undefined | string>}
 */
export async function readLocalOrUrlFile(file: string | URL, options: Parameters<typeof readLocalFile>[1] = 'utf8') {
  if (isUrlString(file)) {
    file = new URL(file);
  }

  try {
    return await readLocalFile(file, options);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return;
    }

    throw new Error(`Unable to read '${file}': ${error.message}`);
  }
}
