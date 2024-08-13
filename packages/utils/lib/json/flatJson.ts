import { merge } from 'lodash';

export interface FlatJsonOptions {
  delimiter: string;
  data: Record<string, any>;
}
export const defaultFlatJsonOptions: FlatJsonOptions = {
  delimiter: '.',
  data: {},
};
/**
 * 将多个层级的变成一个层级的
 */
export function flatJson(options: FlatJsonOptions) {
  const { data, delimiter } = merge(defaultFlatJsonOptions, options);
  const _flattedJson: Record<string, any> = {};
  Object.entries(data).forEach(([key,value])=>{
    
  })
  return _flattedJson
}

flatJson.prototype.defaultFlatJsonOptions = defaultFlatJsonOptions;
