/**
 * @function isBuffer
 * @description 函数用于
 * @param
 * @returns
 * @example
 * isBuffer() // ->
 */
export function isBuffer(value: any): value is Buffer {
  // return value?.constructor === Buffer;
  return value instanceof Buffer;
}
