/**
 * @function md5 
 * @description 函数用于
 * @param 
 * @returns
 * @example
 * md5() // ->
 */
import crypto from 'crypto'
export function md5(value: string) {
  return crypto.createHash('md5').update(value).digest('hex');
}
