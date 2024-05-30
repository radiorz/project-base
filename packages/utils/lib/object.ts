import get from 'lodash/get';

export function getByPath(config: Record<string, any>, path: string = '') {
  if (!path) {
    return config;
  }
  return get(config, path);
}
