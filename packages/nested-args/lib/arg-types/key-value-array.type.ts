import { ArgType } from '../arg-type.interface';

interface KeyValueItem {
  key: string;
  value: string;
}
export const keyValueArrayType: ArgType = {
  isThisType(v: any): boolean {
    return Array.isArray(v) && v.every((item: KeyValueItem) => this.isKeyValueObject(item));
  },
  isKeyValueObject(v: any): boolean {
    return 'key' in v && 'value' in v;
  },
  // [{key: 1,value:2},{key: "foo",value: "bar"}] => 1=2,foo=bar
  stringify(v: any): string {
    if (!v?.length) {
      return '';
    }

    return v
      .map((item: KeyValueItem) => {
        const stringifyValue = JSON.stringify(item?.value);
        return `${item?.key}=${stringifyValue}`;
      })
      .join(',');
  },
  parse(value: string) {
    if (!value) return [];
    return value
      .split(',')
      .map((strItem) => {
        if (!strItem) return undefined;
        const [key, value] = strItem.split('=');
        try {
          return { key, value: JSON.parse(value) };
        } catch (error) {
          return { key, value };
        }
      })
      .filter((i) => i);
  },
};
