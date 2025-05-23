/**
 * @author
 * @file unflatNestedObject.ts
 * @fileBase unflatNestedObject
 * @path packages\utils\lib\json\unflatNestedObject.ts
 * @from
 * @desc
 * @todo
 *
 *
 * @done
 * @example
 */

import _ from 'lodash';
const { set } = _;
export interface unflatNestedObjectOptions {
  delimiter: string;
  data: Record<string, any>;
}

export const defaultunflatNestedObjectOptions: unflatNestedObjectOptions = {
  delimiter: '.',
  data: {},
};

export function unflatNestedObject(options: Partial<unflatNestedObjectOptions> = {}) {
  const { data, delimiter } = Object.assign({}, defaultunflatNestedObjectOptions, options);
  const _unflatNestedObject: Record<string, any> = {};
  Object.entries(data).forEach(([key, value]) => {
    set(_unflatNestedObject, key.split(delimiter).join('.'), value);
  });
  return _unflatNestedObject;
}
