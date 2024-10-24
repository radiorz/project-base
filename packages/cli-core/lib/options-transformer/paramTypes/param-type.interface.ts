export interface ParamType {
  stringify(value: any): string;
  parse(value: string): any;
}
