import _ from 'lodash';
const { set } = _;
import { ListItem } from './json.interface';
export interface ListToJsonOptions {
  delimiter: string;
  list: ListItem[];
  isKeyInclude(v: string): boolean;
  /**
   * 比如将 keyItem 转小写等
   * @param v
   */
  keyItemTransformer(v: string): string;
}
export const defaultListToJsonOptions: ListToJsonOptions = {
  delimiter: '.',
  list: [],
  isKeyInclude: () => true,
  keyItemTransformer: function (v: string): string {
    return v;
  },
};
export function listToJson(options?: Partial<ListToJsonOptions>): Record<string, any> {
  const { delimiter, keyItemTransformer, list, isKeyInclude } = Object.assign(defaultListToJsonOptions, options);
  const json = {};
  list.forEach(({ key, value }) => {
    if (!isKeyInclude(key)) return;
    set(json, key.split(delimiter).map(keyItemTransformer).join('.'), value);
  });
  return json;
}
