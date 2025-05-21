import _ from 'lodash';
const { get } = _;
export function getByPath(config: Record<string, any>, path: string = '') {
  if (!path) {
    return config;
  }
  return get(config, path);
}

