import { ParamType } from './param-type.interface';

export const jsonType: ParamType = {
  stringify(v: any): string {
    return JSON.stringify(v);
  },
  parse(value: any) {
    try {
      return JSON.parse(value);
    } catch (error: any) {
      console.error('JSON parse error:', error?.message);
      return null;
    }
  },
};
