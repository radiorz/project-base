import { ArgType } from '../arg-type.interface';

export const numberType: ArgType = {
  isThisType(value: any): boolean {
    return typeof value === 'number';
  },
  stringify(value: any): string {
    return value.toString();
  },
  parse(value: string) {
    return Number(value);
  },
};
