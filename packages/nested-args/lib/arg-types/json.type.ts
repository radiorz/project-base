import { ArgType } from '../arg-type.interface';

export const jsonType: ArgType<Record<string, any>> = {
  isThisType(v: any): boolean {
    return typeof v === 'object';
  },
  isArgThisType(v: any): boolean {
    return typeof v === 'string' && v.includes('{');
  },
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
