/**
 * @function getDefaultValueFromType
 * @description 函数用于
 * @param
 * @returns
 * @example
 * getDefaultValueFromType() // ->
 */
export function getDefaultValueFromType(type: string): any {
  switch (type) {
    case 'string':
      return ''; // 字符串类型的默认值
    case 'number':
      return 0; // 数字类型的默认值
    case 'boolean':
      return false; // 布尔类型的默认值
    case 'array':
      return []; // 数组类型的默认值
    case 'function':
      return () => {}; // 函数类型的默认值
    case 'object':
      return {}; // 对象类型的默认值
    case 'null':
      return null; // null类型的默认值
    case 'undefined':
      return undefined; // undefined类型的默认值
    default:
      return undefined; // 未知类型的默认值 (可以根据需要自定义)
  }
}
