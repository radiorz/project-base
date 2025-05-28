import { XMLParser } from 'fast-xml-parser';
import { convertToConfig } from '../type';
/**
 * 同步读取并解析XML文件
 * @param xmlPath XML文件路径
 * @returns Promise 解析后的XML对象
 */
export const convertXmlToConfig: convertToConfig = (
  content: any,
  options = {
    ignoreAttributes: true,
  },
) => {
  // 同步读取文件内容
  const parser = new XMLParser(options);
  // 使用xml2js的同步解析方法
  const result = parser.parse(content);
  return result;
};
