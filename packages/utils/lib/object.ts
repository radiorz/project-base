import _ from 'lodash';
const { get } = _;
export function getByPath(config: Record<string, any>, path: string = '') {
  if (!path) {
    return config;
  }
  return get(config, path);
}
// 仅删除 undefined
export function killUndefined(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

export function isEmptyObj(obj: any) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}
//
export function isPlainObject(obj: any) {
  if (!obj) return false;
  return obj.constructor === Object;
}
export function clone(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
/**
 * 调整key顺序
 * @param obj
 * @returns
 */
export function sortKey(obj: Record<string, any>) {
  const sortedObj = Object.keys(obj)
    .sort()
    .reduce((sorted: any, key) => {
      sorted[key] = obj[key];
      return sorted;
    }, {});

  return sortedObj;
}
