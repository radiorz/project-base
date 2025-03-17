export function isValueEmpty(value: string) {
  return typeof value === 'undefined' || value === null;
}
export function killEmpty(obj: any, isEmpty = isValueEmpty) {
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
      return isEmpty(v);
    });
    return obj;
  }

  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'undefined') {
      delete obj[key]; // 关键
    } else if (Array.isArray(value)) {
      obj[key] = killEmpty(value);
    } else if (typeof value === 'object' && value !== null) {
      killEmpty(value);
    }
  });
  return obj;
}
