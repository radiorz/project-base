import _ from 'lodash';
const { get } = _;

/**
 *
 * @param config 配置
 * @param map 映射关系
 * @returns
 */
export function getInfoFromNestedObject(config: Record<string, any>, map?: Record<string, string>) {
  if (isEmpty(map)) {
    return config;
  }
  // 数据不是data
  if (typeof config !== 'object') {
    return config;
  }
  const info: Record<string, any> = {};
  for (const [key, value] of Object.entries(map!)) {
    const valuePath = value.split('.');
    info[key] = get(config, valuePath);
  }
  return info;
}
export function isEmpty(obj: any) {
  if (!obj) {
    return true;
  }
  return Object.keys(obj).length === 0;
}
