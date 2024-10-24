export const TYPES = {
  array: 'array',
  keyValueArray: 'keyValueArray',
  objectArray: 'objectArray',
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
    if (value === 'undefined') {
      return;
    }
    if (type === TYPES.keyValueArray) {
      // stringify 化是 这样  a=b,c=d , 转换回来就是 [{a:b},{c:d}]
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
    if (type === TYPES.objectArray) {
      try {
        return value ? JSON.parse(value) : [];
      } catch (error) {
        return [];
      }
    }
    if (type === TYPES.array) {
      return value.split(',');
    }
    if (type === TYPES.object) {
      return typeof value === 'object' ? JSON.parse(value) : {};
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
  // 单纯就是扁平化
  static toFlatList(obj: Record<string, any>) {}
  static toString(obj: Record<string, any>) {
    const _obj: Record<string, any> = {};
    Object.entries(obj).forEach(([key, value]) => {
      _obj[key] = OptionHandler.toStringValue(value);
    });
    return _obj;
  }
  static isKeyValueObject(obj: any) {
    const keys = Object.keys(obj);
    return keys[0] === 'key' && keys[1] === 'value';
  }
  static toStringValue(value: any) {
    if (Array.isArray(value)) {
      const item1 = value[0];
      // 有点魔法 key value 的值让他们用=表示
      if (typeof item1 === 'object') {
        const isKeyValueArray = this.isKeyValueObject(item1);
        if (isKeyValueArray) {
          // [{key: 1,value:2},{key: "foo",value: "bar"}] => 1=2,foo=bar
          return value.map((item) => `${item.key}=${item.value}`).toString();
        }
        return JSON.stringify(value);
      }
      // [1,2,3]=> 1,2,3
      return value.toString();
    }
    if (typeof value === 'object') {
      return OptionHandler.toString(value);
    }
    return '' + value;
  }
}
