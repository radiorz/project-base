import { TYPES } from './arg.type';
import {
  arrayType,
  booleanType,
  jsonType,
  keyValueArrayType,
  numberType,
  objectArrayType,
  objectType,
} from './arg-types';
import { mergeOptions } from '@tikkhun/utils-core';
import { stringType } from './arg-types/string.type';
export interface NestedArgsOptions {
  schema: Record<string, any>;
  typeHandlers: Record<string, any>;
  types: TYPES | string[];
}
// TODO type是用来注册的，然后parse是用来解析的
export class NestedArgs {
  static options: NestedArgsOptions = {
    schema: {},
    types: [...Object.values(TYPES)],
    typeHandlers: {
      [TYPES.boolean]: booleanType,
      [TYPES.number]: numberType,
      [TYPES.string]: stringType,
      [TYPES.array]: arrayType,
      [TYPES.keyValueArray]: keyValueArrayType,
      [TYPES.json]: jsonType,
      [TYPES.object]: objectType,
      [TYPES.objectArray]: objectArrayType,
    },
  };

  static parse(obj: Record<string, any>, options: Partial<NestedArgsOptions> = this.options) {
    const opts = mergeOptions(this.options, options) as NestedArgsOptions;
    const _obj: Record<string, any> = {};
    Object.entries(obj).forEach(([key, value]) => {
      if (isTheObject(value)) {
        _obj[key] = this.parse(value, { ...opts, schema: opts.schema[key] });
        return;
      }
      const typeName = opts.schema?.[key] || TYPES.string;
      const type = opts.typeHandlers[typeName];
      _obj[key] = type.parse(value as string);
    });
    return _obj;
  }

  static stringify(obj: Record<string, any>, options?: Partial<NestedArgsOptions>) {
    const opts = mergeOptions(this.options, options);
    const _obj: Record<string, any> = {};
    Object.entries(obj).forEach(([key, value]) => {
      const typeName = opts.schema[key] || TYPES.string;

      if (isTheObject(value) && typeof typeName === 'object') {
        _obj[key] = this.stringify(value, { ...opts, schema: opts.schema[key] });
        return;
      }

      const type = opts.typeHandlers[typeName];
      _obj[key] = type.stringify(value);
    });
    return _obj;
  }
  options: NestedArgsOptions;
  constructor(options?: Partial<NestedArgsOptions>) {
    this.options = mergeOptions(NestedArgs.options, options);
  }
  parse(obj: Record<string, any>) {
    return NestedArgs.parse(obj, this.options);
  }
  stringify(obj: Record<string, any>) {
    return NestedArgs.stringify(obj, this.options);
  }
}

function isTheObject(v: any) {
  if (Array.isArray(v)) {
    return false;
  }
  if (typeof v === 'object') {
    return true;
  }
  return false;
}
