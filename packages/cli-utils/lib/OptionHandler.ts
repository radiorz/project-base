export const TYPES = {
  array: 'array',
  keyValueArray: 'keyValueArray',
  boolean: 'boolean',
  number: 'number',
};
export class OptionHandler {
  schema: Record<string, any>;
  constructor(schema: Record<string, any>) {
    this.schema = schema;
  }

  static getTypeValue(value: string, type: string) {
    if (type === 'array') {
      return value.split(',');
    }
    if (type === 'keyValueArray') {
      return value.split(',').map((strItem) => {
        const [key, value] = strItem.split('=');
        return { key, value };
      });
    }
    if (type === 'number') {
      return Number(value);
    }
    if (type === 'boolean') {
      if (value === 'true') return true;
      if (value === 'false') return false;
      if (value === '1') return true;
      if (value === '0') return true;
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
      }
      _obj[key] = OptionHandler.getTypeValue(value as string, type);
    });
    return _obj;
  }
  toType(obj: Record<string, any>) {
    return OptionHandler.toType(obj, this.schema);
  }
  static toString(obj: Record<string, any>) {
    const _obj: Record<string, any> = {};
    Object.entries(obj).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        const item1 = value[0];
        // 有点魔法 key value 的值让他们用=表示
        if (typeof item1 === 'object' && item1.hasOwnProperty('key') && item1.hasOwnProperty('value')) {
          _obj[key] = value.map((item) => `${item.key}=${item.value}`).toString();
          return;
        }
        _obj[key] = value.toString();
        return;
      }
      if (typeof value === 'object') {
        _obj[key] = OptionHandler.toString(value);
        return;
      }
      _obj[key] = '' + value;
    });
    return _obj;
  }
}
