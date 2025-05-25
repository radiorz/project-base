import { ParamType } from './param-type.interface';

export const objectType: ParamType = {
  stringify(v: any): string {
    return JSON.stringify(v);
  },
  parse(value: any) {
    return typeof value === 'object' ? JSON.parse(value) : {};
  },
};
