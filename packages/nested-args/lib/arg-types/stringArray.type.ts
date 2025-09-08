import { ArgType } from '../arg-type.interface';

export const stringArrayType: ArgType<string[]> = {
  isThisType(v: any): boolean {
    return Array.isArray(v) && typeof v[0] !== 'object' && typeof v[0] === 'string';
  },
  isArgThisType(v: string): boolean {
    return typeof v === 'string' && v.includes(',');
  },
  // ["1","2","3"]=> "1,2,3"
  stringify(v: any): string {
    return v.join(',');
  },
  // "1,2,3"=>["1","2","3"]
  parse(v: string) {
    return v.split(',');
  },
};
