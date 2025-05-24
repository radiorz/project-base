import { ParamType } from './param-type.interface';

export const numberType: ParamType = {
  stringify(value: any): string {
    return value.toString();
  },
  parse(value: string) {
    return Number(value);
  },
};
