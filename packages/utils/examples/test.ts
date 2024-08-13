export interface FlatJsonOptions {
  delimiter: string;
  data: Record<string, any>;
  prefix?: string;
}

export const defaultFlatJsonOptions: FlatJsonOptions = {
  delimiter: '.',
  data: {},
  prefix: '',
};

export function flatJson(options: Partial<FlatJsonOptions>): Record<string, any> {
  const { data, delimiter, prefix } = Object.assign(defaultFlatJsonOptions, options);
  return Object.entries(data).reduce((acc = {}, [key, value]) => {
    const newPrefix = prefix ? `${prefix}${delimiter}${key}` : key;
    if (typeof value === 'object' && value !== null) {
      return { ...acc, ...flatJson({ prefix: newPrefix, data: value, delimiter }) };
    } else {
      return { ...acc, [newPrefix]: value };
    }
  }, {});
}

flatJson.prototype.defaultFlatJsonOptions = defaultFlatJsonOptions;

// 使用示例
const nestedJson = { a: { b: { c: 123 } } };
const flattedJson = flatJson({ data: nestedJson });
console.log(flattedJson); // Output: { 'a.b.c': 123 }
