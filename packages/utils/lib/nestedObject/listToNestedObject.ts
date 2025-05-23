import _ from 'lodash';
const { set } = _;
import { ListItem } from './nestedObject.interface';
export interface ListToNestedObjectOptions {
  delimiter: string;
  list: ListItem[];
  isKeyInclude(v: string): boolean;
  /**
   * 比如将 keyItem 转小写等
   * @param v
   */
  keyItemTransformer(v: string): string;
}
export const defaultListToNestedObjectOptions: ListToNestedObjectOptions = {
  delimiter: '.',
  list: [],
  isKeyInclude: () => true,
  keyItemTransformer: function (v: string): string {
    return v;
  },
};
export function listToNestedObject(options?: Partial<ListToNestedObjectOptions>): Record<string, any> {
  const { delimiter, keyItemTransformer, list, isKeyInclude } = Object.assign({}, defaultListToNestedObjectOptions, options);
  const json = {};
  list.forEach(({ key, value }) => {
    if (!isKeyInclude(key)) return;
    const keys = key.split(delimiter).map(keyItemTransformer);
    // set 会将数字设置为数组,这个权当特性了. 比如 "a.1"="aaa" {a: ["aaa"]}
    set(json, keys.join('.'), value);
  });
  return json;
}
