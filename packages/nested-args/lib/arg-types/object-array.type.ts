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
      // 将所有单引号替换为双引号
      if (v.includes("'")) {
        v = v.replace(/'/g, '"');
      }
      return JSON.parse(v) || [];
    } catch (error: any) {
      console.warn(`parse objectArray,but error: `, error?.message, 'value: ', v);
      return [];
    }
  },
};
