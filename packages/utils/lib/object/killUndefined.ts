// 仅删除 undefined
// export function killUndefined(value: Record<string, any> | any) {
//   try {
//     return JSON.parse(JSON.stringify(value));
//   } catch (e) {
//     // 部分格式无法序列化，
//     const _value = {}
//     return _value
//   }
// }
// /** 去除对象 value 为 undefined的值 */
export function killUndefined(obj: any) {
  if (obj === null) return obj;
  if (typeof obj === 'undefined') return obj;
  if (typeof obj === 'string') return obj;
  if (typeof obj === 'number') return obj;
  if (typeof obj === 'boolean') return obj;
  if (typeof obj === 'symbol') return obj;
  if (typeof obj === 'bigint') return obj;
  if (typeof obj === 'function') return obj;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    obj = obj.filter((v) => {
      return typeof v !== 'undefined';
    });
    return obj;
  }

  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'undefined') {
      delete obj[key]; // 关键
    } else if (Array.isArray(value)) {
      obj[key] = killUndefined(value);
    } else if (typeof value === 'object' && value !== null) {
      killUndefined(value);
    }
  });
  return obj;
}
