import get from 'lodash/get';

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
