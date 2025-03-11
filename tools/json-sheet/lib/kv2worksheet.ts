import { utils, WorkSheet } from 'xlsx';
export interface Kv2WorkbookOptions {
  data: Record<string, any>;
  keyHeader?: string;
  valueHeader?: string;
}
export function kv2worksheet({ data, keyHeader, valueHeader }: Kv2WorkbookOptions): WorkSheet {
  // 创建工作簿和工作表
  // 将键值对转换为二维数组
  const sheetData = [
    [keyHeader ?? 'Key', valueHeader ?? 'Value'], // 表头
    ...Object.entries(data), // 转换为键值对行
  ];

  const worksheet = utils.aoa_to_sheet(sheetData);
  return worksheet;
}
