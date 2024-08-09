export class OptionHandler {
  schema: Record<string, any>;
  constructor(schema: Record<string, any>) {
    this.schema = schema;
  }

  static getTypeValue(value: string, type: string) {
    if (type === 'array') {
      return value.split(',');
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
  static toType(obj: Record<string, any>, schema: Record<string, any>) {
    const _obj: Record<string, any> = {};
    console.log(`obj`, obj);
    Object.entries(obj).forEach(([key, value]) => {
      const type = schema[key];
      if (typeof value === 'object') {
        _obj[key] = OptionHandler.toType(value, type);
      }
      _obj[key] = OptionHandler.getTypeValue(value, type);
    });
    return _obj;
  }
  toType(obj: Record<string, any>) {
    return OptionHandler.toType(obj, this.schema);
  }
  toString(obj: Record<string, any>) {
    const _obj: Record<string, any> = {};
    Object.entries(obj).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        _obj[key] = value.toString();
        return;
      }
      if (typeof value === 'object') {
        _obj[key] = this.toString(value);
        return;
      }
      _obj[key] = '' + value;
    });
  }
}
