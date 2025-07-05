
import { nativeNumber } from '../regex/regex';

/**
 * 检查传入的值是否为原生数字格式。
 * 使用预定义的正则表达式 `nativeNumber` 进行匹配判断。
 * 
 * @param {any} n - 待检查的值，可以是任意类型。
 * @returns {boolean} - 如果传入的值匹配原生数字格式，返回 `true`；否则返回 `false`。
 */
export function isNativeNumber(n: any) {
  return nativeNumber.test(n);
}
