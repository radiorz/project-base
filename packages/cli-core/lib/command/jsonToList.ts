// import { ListItem } from './json.interface';
interface ListItem {
  key: string;
  value: any;
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
  const { delimiter, json, prefix }: JsonToListOptions = Object.assign({}, defaultJsonToListOptions, options);
  return Object.keys(json).reduce((acc: ListItem[], key: string) => {
    console.log(`acc,key`, acc, key);
    const propKey = prefix ? `${prefix}${delimiter}${key}` : key;
    console.log(`propKey`, propKey);
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
