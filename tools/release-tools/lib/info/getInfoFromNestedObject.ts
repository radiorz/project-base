import { Info } from './info.interface';
import _ from 'lodash';
const { get } = _;

/**
 *
 * @param config 配置
 * @param map 映射关系
 * @returns
 */
export function getInfoFromNestedObject(config: Record<string, any>, map: Record<keyof Info | string, string>): Info {
  const info: Record<string, any> = {};
  for (const [key, value] of Object.entries(map)) {
    const valuePath = value.split('.');
    info[key] = get(config, valuePath);
  }
  return info;
}
