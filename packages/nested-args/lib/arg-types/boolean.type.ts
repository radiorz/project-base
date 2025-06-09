import { ArgType } from '../arg-type.interface';
export const asTrueArgs = ['true', true, '1', 1];
export const asFalseArgs = ['false', false, '', 0];
export const booleanType: ArgType = {
  isThisType(value: any): boolean {
    return typeof value === 'boolean';
  },
  isArgThisType(value: string): boolean {
    return asTrueArgs.includes(value) || asFalseArgs.includes(value);
  },
  stringify(value: boolean): string {
    return value.toString();
  },
  parse(value: string): boolean {
    if (asTrueArgs.includes(value)) return true;
    return false;
  },
};
