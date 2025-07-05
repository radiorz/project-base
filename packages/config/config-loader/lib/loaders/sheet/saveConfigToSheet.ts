import { writeFile } from 'xlsx';
import { Config } from '../../type';
import { convertToSheetFromConfig } from './convertToSheetFromConfig';

/**
 * @function saveConfigToSheet
 * @description 函数用于
 * @param
 * @returns
 * @example
 * saveConfigToSheet() // ->
 */
export function saveConfigToSheet(config: Config, filePath?: string, options?: any) {
  const workbook = convertToSheetFromConfig(config, options);
  writeFile(workbook, filePath || 'config.xlsx');
}
