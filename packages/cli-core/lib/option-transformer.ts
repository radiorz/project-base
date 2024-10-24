import { arrayType } from './paramTypes/array.type';
import { booleanType } from './paramTypes/boolean.type';
import { keyValueArrayType } from './paramTypes/key-value-array.type';
import { numberType } from './paramTypes/number.type';
import { objectArrayType } from './paramTypes/object-array.type';
import { objectType } from './paramTypes/object.type';

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

export class OptionTransformer {
  schema: Record<string, any>;
  constructor(schema: Record<string, any>) {
    this.schema = schema;
  }
  parse(obj: Record<string, any>) {
    return OptionTransformer.parse(obj, this.schema);
  }

  static parse(obj: Record<string, any>, schema: Record<string, any>) {
    const _obj: Record<string, any> = {};
    Object.entries(obj).forEach(([key, value]) => {
      const type = schema[key];
      if (typeof value === 'object') {
        _obj[key] = OptionTransformer.parse(value, type);
      } else {
        _obj[key] = OptionTransformer.parseValueByType(value as string, type);
      }
    });
    return _obj;
  }
  private static parseValueByType(value: string, type: string) {
    if (value === 'undefined') {
      return;
    }
    if (type === TYPES.keyValueArray) {
      return keyValueArrayType.parse(value);
    }
    if (type === TYPES.objectArray) {
      return objectArrayType.parse(value);
    }
    if (type === TYPES.array) {
      return arrayType.parse(value);
    }
    if (type === TYPES.object) {
      return objectType.parse(value);
    }
    if (type === TYPES.number) {
      return numberType.parse(value);
    }
    if (type === TYPES.boolean) {
      return booleanType.parse(value);
    }
    return value;
  }
  static stringify(obj: Record<string, any>) {
    const _obj: Record<string, any> = {};
    Object.entries(obj).forEach(([key, value]) => {
      _obj[key] = OptionTransformer.stringifyValue(value);
    });
    return _obj;
  }

  private static stringifyValue(value: any) {
    if (Array.isArray(value)) {
      const item1 = value[0];
      // 有点魔法 key value 的值让他们用=表示
      if (typeof item1 === 'object') {
        const isKeyValueArray = this.isKeyValueObject(item1);
        if (isKeyValueArray) {
          return keyValueArrayType.stringify(value);
        }
        return objectArrayType.stringify(value);
      }
      return arrayType.stringify(value);
    }
    if (typeof value === 'object') {
      return OptionTransformer.stringify(value);
    }
    return '' + value;
  }
  private static isKeyValueObject(obj: any) {
    const keys = Object.keys(obj);
    return keys[0] === 'key' && keys[1] === 'value';
  }
}
