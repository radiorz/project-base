import { readJSON } from 'fs-extra';
import { flatJson } from '../../../packages/utils/lib/json/flatJson';
import { kv2worksheet } from './kv2worksheet';
import { utils, writeFile } from 'xlsx';
export interface Json2SheetOptions {
  input: string;
  output: string;
  keyHeader: string;
  valueHeader: string;
}
export async function json2Sheet({ input, output, keyHeader, valueHeader }: Json2SheetOptions) {
  const jsonData = await readJSON(input);
  const flattedData = flatJson(jsonData);
  const worksheet = kv2worksheet({ data: flattedData, keyHeader, valueHeader });
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  writeFile(workbook, output);
}
