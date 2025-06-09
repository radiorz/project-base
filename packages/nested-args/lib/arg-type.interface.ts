export interface ArgType<OriginType = any> {
  isThisType: (value: any) => boolean;
  isArgThisType: (value: string) => boolean;
  stringify: (value: OriginType) => string;
  parse: (value: string) => OriginType;
  [key: string]: any;
}
