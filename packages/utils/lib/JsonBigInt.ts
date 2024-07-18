/**
 * @author
 * @file JsonBigInt.ts
 * @fileBase JsonBigInt
 * @path packages\json-bigint\lib\JsonBigInt.ts
 * @from
 * @desc
 * @todo
 *
 *
 * @done
 * @example
 */

export interface JsonBigIntOptions {
  magicString: string;
}
export const DEFAULT_JSON_BIGINT_OPTIONS = {
  magicString: 'tikkhun-json-bigint',
};
export class JsonBigInt {
  options: JsonBigIntOptions;
  constructor(options?: Partial<JsonBigIntOptions>) {
    this.options = Object.assign(DEFAULT_JSON_BIGINT_OPTIONS, options);
  }
  private reviver(key: any, value: any) {
    if (typeof value === 'string' && value.includes(this.options.magicString)) {
      const _value = value.replace(new RegExp(this.options.magicString, 'g'), '');
      return BigInt(_value);
    }

    return value;
  }
  parse(str: string) {
    return JSON.parse(str, this.reviver.bind(this));
  }
  private replacer(key: any, value: any) {
    if (isBigInt(value)) {
      return `${this.options.magicString}${value}${this.options.magicString}`;
    }
    return value;
  }
  stringify(json: Record<string, any>) {
    return JSON.stringify(json, this.replacer.bind(this));
  }
}
export function isBigInt(v: any) {
  return typeof v === 'bigint';
}
