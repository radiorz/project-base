import { ParamType } from './param-type.interface';

interface KeyValueItem {
  key: string;
  value: string;
}
export const keyValueArrayType: ParamType = {
  // [{key: 1,value:2},{key: "foo",value: "bar"}] => 1=2,foo=bar
  stringify(v: any): string {
    if (!v?.length) {
      return '';
    }
    return v.map((item: KeyValueItem) => `${item?.key}=${item?.value}`).join(',');
  },
  parse(value: string) {
    if (!value) return [];
    return value
      .split(',')
      .map((strItem) => {
        if (!strItem) return undefined;
        const [key, value] = strItem.split('=');
        return { key, value };
      })
      .filter((i) => i);
  },
};
