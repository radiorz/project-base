export const TYPES = {
  array: 'array',
  keyValueArray: 'keyValueArray',
  boolean: 'boolean',
  number: 'number',
  object: 'object',
  string: 'string',
  select: 'select', // 几个中进行选择 选择一项
} as const;
export type TYPES = keyof typeof TYPES;
export const asTrueValues = ['true', true, '1', 1];
export const asFalseValues = ['false', false, '', 0];
export class OptionHandler {
  schema: Record<string, any>;
  constructor(schema: Record<string, any>) {
    this.schema = schema;
  }
  static getTypeValue(value: string, type: string) {
    if (type === TYPES.array) {
      return value.split(',');
    }
    if (type === TYPES.object) {
      return JSON.parse(value);
    }
    if (type === TYPES.keyValueArray) {
      if (!value) return [];
      return value
        .split(',')
        .map((strItem) => {
          if (!strItem) return undefined;
          const [key, value] = strItem.split('=');
          return { key, value };
        })
        .filter((i) => i);
    }
    if (type === TYPES.number) {
      return Number(value);
    }
    if (type === TYPES.boolean) {
      if (asTrueValues.includes(value)) return true;
      return false;
    }
    return value;
  }
  static toType(obj: Record<string, string | Record<string, string>>, schema: Record<string, any>) {
    const _obj: Record<string, any> = {};
    Object.entries(obj).forEach(([key, value]) => {
      const type = schema[key];
      if (typeof value === 'object') {
        _obj[key] = OptionHandler.toType(value, type);
      } else {
        _obj[key] = OptionHandler.getTypeValue(value as string, type);
      }
    });
    return _obj;
  }
  toType(obj: Record<string, any>) {
    return OptionHandler.toType(obj, this.schema);
  }
  static toString(obj: Record<string, any>) {
    const _obj: Record<string, any> = {};
    Object.entries(obj).forEach(([key, value]) => {
      _obj[key] = OptionHandler.toStringValue(value);
    });
    return _obj;
  }
  static toStringValue(value: any) {
    if (Array.isArray(value)) {
      const item1 = value[0];
      // 有点魔法 key value 的值让他们用=表示
      if (typeof item1 === 'object' && item1.hasOwnProperty('key') && item1.hasOwnProperty('value')) {
        return value.map((item) => `${item.key}=${item.value}`).toString();
      }
      return value.toString();
    }
    if (typeof value === 'object') {
      return OptionHandler.toString(value);
    }
    return '' + value;
  }
}
