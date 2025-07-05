//
export function isPlainObject(obj: any) {
  if (!obj) return false;
  return obj.constructor === Object;
}
