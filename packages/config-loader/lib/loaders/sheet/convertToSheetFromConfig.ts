import { flatNestedObject } from '@tikkhun/utils-core';
import { utils, WorkBook } from 'xlsx';
import type { Config, convertFromConfig } from '../../type';
import { kv2worksheet } from './kv2worksheet';
export interface SaveToSheetOptions {
  delimiter?: string;
  keyHeader?: string;
  valueHeader?: string;
  sheetName?: string;
}
export const convertToSheetFromConfig: convertFromConfig = (data: Config, options?: SaveToSheetOptions): WorkBook => {
  const { delimiter = '__', keyHeader = 'key', valueHeader = 'value', sheetName = 'Sheet1' } = options || {};
  const flattedData = flatNestedObject({ data, delimiter: delimiter });
  const worksheet = kv2worksheet({ data: flattedData, keyHeader, valueHeader });
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, sheetName);
  return workbook;
};
