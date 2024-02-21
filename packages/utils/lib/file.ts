import fs from "fs";
import util from "util";
export async function checkFileExists(filename: string) {
  return !(await util
    .promisify(fs.access)(filename, fs.constants.F_OK)
    .catch(() => {
      return true;
    }));
}

