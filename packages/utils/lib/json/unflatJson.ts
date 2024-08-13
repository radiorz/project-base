/**
 * @author
 * @file unflatJson.ts
 * @fileBase unflatJson
 * @path packages\utils\lib\json\unflatJson.ts
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
export interface unflatJsonOptions {
  delimiter: string;
  data: Record<string, any>;
}

export const defaultunflatJsonOptions: unflatJsonOptions = {
  delimiter: '.',
  data: {},
};

export function unflatJson(options: Partial<unflatJsonOptions> = {}) {
  const { data, delimiter } = Object.assign(defaultunflatJsonOptions, options);
  const _unflatJson: Record<string, any> = {};
  Object.entries(data).forEach(([key, value]) => {
    set(_unflatJson, key.split(delimiter).join('.'), value);
  });
  return _unflatJson;
}
