import { readFile } from 'xlsx';
import { loadFromFile } from '../../type';
import { convertToConfigFromSheet, ConvertToConfigFromSheetOptions } from './convertToConfigFromSheet';

export const loadConfigFromSheet: loadFromFile<ConvertToConfigFromSheetOptions> = async function loadConfigFromSheet(
  filePath: string,
  options?: Partial<ConvertToConfigFromSheetOptions>,
) {
  // 读取文件
  // 1. 读取 Excel 文件
  const workbook = await readFile(filePath);
  // 解析文件
  const config = convertToConfigFromSheet(workbook, options);
  // 返回数据
  return config;
};
