import { ParamType } from './param-type.interface';

export interface KeyValueItem {
  key: string;
  value: string;
}
export const arrayType: ParamType = {
  // [1,2,3]=> 1,2,3
  stringify(v: any): string {
    if (!v?.length) {
      return '';
    }
    return v.toString();
  },
  parse(v: string) {
    return v.split(',');
  },
};
