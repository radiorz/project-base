import { ParamType } from './param-type.interface';

export const objectArrayType: ParamType = {
  stringify(v: any): string {
    return JSON.stringify(v);
  },
  parse(v: string) {
    try {
      return JSON.parse(v) || [];
    } catch (error) {
      return [];
    }
  },
};
