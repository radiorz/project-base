import { ArgType } from '../arg-type.interface';

export const objectArrayType: ArgType = {
  isThisType(v: any): boolean {
    return Array.isArray(v);
  },
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
