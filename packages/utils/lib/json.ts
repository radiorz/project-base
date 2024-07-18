import fsExtra from 'fs-extra';
import { set } from 'lodash';
import { packageJsonPath } from './path';
const { readJson } = fsExtra;
export async function getPackageJson() {
  return await readJson(packageJsonPath);
}
export interface ListItem {
  key: string;
  value: any;
}
export interface ListToJsonOptions {
  delimiter: string;
  list: ListItem[];
}
export function listToJson(options: ListToJsonOptions): Record<string, any> {
  const json = {};
  options.list.forEach(({ key, value }) => {
    set(json, key.split(options.delimiter).join('.'), value);
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
