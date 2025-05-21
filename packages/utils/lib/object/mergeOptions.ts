import _ from 'lodash';
/**
 * 选项合并
 * @param args
 * @returns
 */
export function mergeOptions(...args: any[]) {
  // {} 确保不会合并到其他数组
  // args 就是每个数据
  // customizer主要为了让数组不是合并而是直接替换(数组经常是替换而不是合并)
  return _.mergeWith({}, ...args, MergeOptionsCustomizer);
}
/**
 * @deprecated
 */
export const optionsMerge = mergeOptions;

function MergeOptionsCustomizer(objValue: any, srcValue: any) {
  if (Array.isArray(srcValue)) {
    return srcValue;
  }
}
