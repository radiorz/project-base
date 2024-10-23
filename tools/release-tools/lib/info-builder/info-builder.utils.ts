import path from "path";

/**
 * @function getFileNameByPath
 * @description 函数用于
 * @param
 * @returns
 * @example
 * getFileNameByPath() // ->
 */
export function getFileNameByPath(filePath: string) {
  return path.basename(filePath);
}
