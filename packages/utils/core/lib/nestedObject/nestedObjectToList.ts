import { ListItem } from './nestedObject.interface';
export interface NestedObjectToListOptions {
  delimiter: string;
  json: Record<string, any>;
  prefix?: string;
}
export const defaultNestedObjectToListOptions: NestedObjectToListOptions = {
  delimiter: '.',
  json: {},
};
export function nestedObjectToList(options?: Partial<NestedObjectToListOptions>): ListItem[] {
  const { delimiter, json, prefix }: NestedObjectToListOptions = Object.assign({}, defaultNestedObjectToListOptions, options);
  return Object.keys(json).reduce((acc: ListItem[], key: string) => {
    const propKey = prefix ? `${prefix}${delimiter}${key}` : key;

    if (typeof json[key] === 'object' && json[key] !== null) {
      const subList = nestedObjectToList({ ...options, json: json[key], prefix: propKey });
      if (subList && subList.length) {
        return acc.concat(subList);
      }
    } else {
      return acc.concat({ key: propKey, value: json[key] });
    }

    return acc;
  }, []);
}
