import { ArgType } from '../arg-type.interface';

export const objectType: ArgType = {
  isThisType(v: any): boolean {
    return typeof v === 'object';
  },
  stringify(v: any): string {
    return JSON.stringify(v);
  },
  parse(value: any) {
    try {
      return JSON.parse(value);
    } catch (error) {
      return {};
    }
  },
};
