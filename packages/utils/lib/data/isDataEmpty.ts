/**
 * @function isDataEmpty
 * @description 函数用于判断数据是否为空。empty 包括空字符串，空数组，空对象，空函数，0，['']，null，undefined。
 * @param data - 待判断的数据
 * @returns 如果数据为空返回 true，否则返回 false
 * @example
 * isDataEmpty('') // -> true
 * isDataEmpty([]) // -> true
 * isDataEmpty({}) // -> true
 * isDataEmpty(() => {}) // -> true
 * isDataEmpty(0) // -> true
 * isDataEmpty(['']) // -> true
 * isDataEmpty(null) // -> true
 * isDataEmpty(undefined) // -> true
 * isDataEmpty('hello') // -> false
 * isDataEmpty([1]) // -> false
 * isDataEmpty({ key: 'value' }) // -> false
 */
export function isDataEmpty(data: any): boolean {
  // 处理 null 和 undefined
  if (data === null || data === undefined) {
    return true;
  }

  // 处理数字 0
  if (typeof data === 'number' && data === 0) {
    return true;
  }

  // 处理字符串
  if (typeof data === 'string' && data.length === 0) {
    return true;
  }

  // 处理数组
  if (Array.isArray(data)) {
    if (data.length === 0 || (data.length === 1 && data[0] === '')) {
      return true;
    }
  }

  // 处理对象
  if (typeof data === 'object' &&!Array.isArray(data)) {
    if (Object.keys(data).length === 0) {
      return true;
    }
  }

  // 处理函数
  if (typeof data === 'function') {
    return true;
  }

  return false;
}
