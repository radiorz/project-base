import { ArgType } from '../arg-type.interface';
export const asTrueValues = ['true', true, '1', 1];
export const asFalseValues = ['false', false, '', 0];
export const booleanType: ArgType = {
  isThisType(value: any): boolean {
    return typeof value === 'boolean';
  },
  stringify(value: boolean): string {
    return value.toString();
  },
  parse(value: string) {
    if (asTrueValues.includes(value)) return true;
    return false;
  },
};
