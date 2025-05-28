import { writeJson } from 'fs-extra';
import { readFile, utils } from 'xlsx';
import { unflatNestedObject } from '../../../packages/utils/lib/json/unflatNestedObject';

export interface Sheet2JsonOptions {
  input: string; // 输入文件路径（Excel 文件）
  output: string; // 输出文件路径（JSON 文件）
  delimiter?: string;
  keyHeader?: string; // 键列的表头名称
  valueHeader?: string; // 值列的表头名称
}

export async function sheet2json({
  input,
  output,

}: Sheet2JsonOptions) {
  // 1. 读取 Excel 文件
  const workbook = readFile(input);

  // 2. 获取第一个工作表
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

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
  const unFlattedResult = unflatNestedObject({ data: result, delimiter: delimiter });
  // 5. 将结果写入 JSON 文件
  await writeJson(output, unFlattedResult);
}
