import { readJSON } from 'fs-extra';
import { flatNestedObject } from '../../../packages/utils/lib/json/flatNestedObject';
import { kv2worksheet } from './kv2worksheet';
import { utils, writeFile } from 'xlsx';
import { isAbsolute, join } from 'path';
export interface Json2SheetOptions {
  input: string;
  output: string;
  delimiter?: string;
  keyHeader?: string;
  valueHeader?: string;
}
export async function json2Sheet({ input, output, delimiter, keyHeader, valueHeader }: Json2SheetOptions) {
  let jsonData = null;
  if (!isAbsolute(input)) {
    input = join(process.cwd(), input);
  }
  console.log('input', input);
  try {
    // 兼容 js 的情况
    if (input.endsWith('.js')) {
      jsonData = require(input).default;
    } else {
      jsonData = await readJSON(input);
    }
  } catch (error) {
    throw new Error('获取json数据失败,原因为:' + error);
  }
  const flattedData = flatNestedObject({ data: jsonData, delimiter: delimiter || '__' });
  const worksheet = kv2worksheet({ data: flattedData, keyHeader, valueHeader });
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  writeFile(workbook, output);
}
