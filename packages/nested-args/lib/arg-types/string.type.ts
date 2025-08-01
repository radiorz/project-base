import { ArgType } from '../arg-type.interface';
export const stringType: ArgType = {
  isThisType(value: any): boolean {
    return typeof value === 'string';
  },
  isArgThisType(value: string): boolean {
    return true;
  },
  stringify(value: string): string {
    return value;
  },
  parse(value: string) {
    return value;
  },
};
