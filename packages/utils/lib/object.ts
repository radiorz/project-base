import _ from 'lodash';
const { get } = _;
export function getByPath(config: Record<string, any>, path: string = '') {
  if (!path) {
    return config;
  }
  return get(config, path);
}
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
/**
 * 选项合并
 * @param args
 * @returns
 */
export function optionsMerge(...args: any[]) {
  // {} 确保不会合并到其他数组
  // args 就是每个数据
  // customizer主要为了让数组不是合并而是直接替换(数组经常是替换而不是合并)
  return _.mergeWith({}, ...args, optionMergeCustomizer);
}

function optionMergeCustomizer(objValue: any, srcValue: any) {
  if (Array.isArray(srcValue)) {
    return srcValue;
  }
}
