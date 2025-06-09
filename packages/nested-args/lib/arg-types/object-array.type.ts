import { ArgType } from '../arg-type.interface';

export const objectArrayType: ArgType = {
  isThisType(v: any): boolean {
    return Array.isArray(v);
  },
  isArgThisType(v: any): boolean {
    return typeof v === 'string' && v.includes('[{');
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
