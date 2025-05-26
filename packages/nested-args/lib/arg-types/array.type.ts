import { ArgType } from '../arg-type.interface';

export interface KeyValueItem {
  key: string;
  value: string;
}
export const arrayType: ArgType = {
  isThisType(v: any): boolean {
    return Array.isArray(v);
  },
  // isArgThisType(v: any): boolean {
  //   return v.includes(',');
  // },
  // [1,2,3]=> 1,2,3
  stringify(v: any): string {
    if (!v?.length) {
      return '';
    }
    if (!Array.isArray(v)) {
      return v.toString();
    }
    return v.map((item) => JSON.stringify(item)).toString();
  },
  // 1,2,3 => [1,2,3]
  parse(v: string) {
    return v.split(',').map((item) => JSON.parse(item));
  },
};
