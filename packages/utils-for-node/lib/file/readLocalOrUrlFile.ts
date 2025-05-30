import { readFile as readLocalFile } from 'node:fs/promises';
import { isUrlString } from 'url-or-path';

/**
 * @param {string | URL} file
 * @returns {Promise<undefined | string>}
 */
export async function readLocalOrUrlFile(file: string | URL) {
  if (isUrlString(file)) {
    file = new URL(file);
  }

  try {
    return await readLocalFile(file, 'utf8');
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return;
    }

    throw new Error(`Unable to read '${file}': ${error.message}`);
  }
}
