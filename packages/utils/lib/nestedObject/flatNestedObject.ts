export interface FlatNestedObjectOptions {
  delimiter: string;
  data: Record<string, any>;
  prefix?: string;
}

export const defaultFlatNestedObjectOptions: FlatNestedObjectOptions = {
  delimiter: '.',
  data: {},
  prefix: '',
};

export function flatNestedObject(options: Partial<FlatNestedObjectOptions>): Record<string, any> {
  const { data, delimiter, prefix } = Object.assign({}, defaultFlatNestedObjectOptions, options);
  return Object.entries(data).reduce((acc = {}, [key, value]) => {
    const newPrefix = prefix ? `${prefix}${delimiter}${key}` : key;
    if (typeof value === 'object' && value !== null) {
      return { ...acc, ...flatNestedObject({ prefix: newPrefix, data: value, delimiter }) };
    } else {
      return { ...acc, [newPrefix]: value };
    }
  }, {});
}

flatNestedObject.prototype.defaultFlatNestedObjectOptions = defaultFlatNestedObjectOptions;
