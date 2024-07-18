import { set } from 'lodash';
export interface ListItem {
  key: string;
  value: any;
}
export interface ListToJsonOptions {
  delimiter: string;
  list: ListItem[];
  /**
   * 比如将 keyItem 转小写等
   * @param v
   */
  keyItemTransformer(v: string): string;
}
export const defaultListToJsonOptions: ListToJsonOptions = {
  delimiter: '.',
  list: [],
  keyItemTransformer: function (v: string): string {
    return v;
  },
};
export function listToJson(options?: Partial<ListToJsonOptions>): Record<string, any> {
  const { delimiter, keyItemTransformer, list } = Object.assign(defaultListToJsonOptions, options);
  const json = {};
  list.forEach(({ key, value }) => {
    set(json, key.split(delimiter).map(keyItemTransformer).join('.'), value);
  });
  return json;
}

export interface JsonToListOptions {
  delimiter: string;
  json: Record<string, any>;
  prefix?: string;
}
export const defaultJsonToListOptions: JsonToListOptions = {
  delimiter: '.',
  json: {},
};
export function jsonToList(options?: Partial<JsonToListOptions>): ListItem[] {
  const { delimiter, json, prefix }: JsonToListOptions = Object.assign(defaultJsonToListOptions, options);
  return Object.keys(json).reduce((acc: ListItem[], key: string) => {
    const propKey = prefix ? `${prefix}${delimiter}${key}` : key;

    if (typeof json[key] === 'object' && json[key] !== null) {
      const subList = jsonToList({ ...options, json: json[key], prefix: propKey });
      if (subList && subList.length) {
        return acc.concat(subList);
      }
    } else {
      return acc.concat({ key: propKey, value: json[key] });
    }

    return acc;
  }, []);
}
