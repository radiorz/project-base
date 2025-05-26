export interface ArgType {
  isThisType: (value: any) => boolean;
  stringify: (value: any) => string;
  parse: (value: string) => any;
  [key: string]: any;
}
