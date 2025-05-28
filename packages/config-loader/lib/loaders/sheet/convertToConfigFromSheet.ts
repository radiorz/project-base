import { unflatNestedObject } from '@tikkhun/utils-core';
import { WorkBook, utils } from 'xlsx';
export interface ConvertToConfigFromSheetOptions {
  delimiter?: string;
  keyHeader?: string;
  valueHeader?: string;
  sheetNumber?: number;
}
export function convertToConfigFromSheet(workbook: WorkBook, options?: ConvertToConfigFromSheetOptions) {
  const { sheetNumber = 0, delimiter = '__', keyHeader = 'key', valueHeader = 'value' } = options || {};
  // 获取第一个工作表
  const worksheet = workbook.Sheets[workbook.SheetNames[sheetNumber]];
  // 3. 将工作表转换为 JSON 格式
  const jsonData = utils.sheet_to_json(worksheet, { header: 1 }); // header: 1 表示将数据按行读取为数组

  // 4. 提取键值对
  const result: Record<string, any> = {};
  const headers = jsonData[0] as string[]; // 获取表头

  // 找到键列和值列的索引
  const keyIndex = headers.indexOf(keyHeader);
  const valueIndex = headers.indexOf(valueHeader);

  if (keyIndex === -1 || valueIndex === -1) {
    throw new Error(`表头中未找到 "${keyHeader}" 或 "${valueHeader}" 列`);
  }

  // 遍历数据行，提取键值对
  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i] as any[];
    const key = row[keyIndex];
    const value = row[valueIndex];
    result[key] = value;
  }
  return unflatNestedObject({ data: result, delimiter: delimiter });
}
