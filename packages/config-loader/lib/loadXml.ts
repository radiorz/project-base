import fs from 'fs';
import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser';
/**
 * 同步读取并解析XML文件
 * @param xmlPath XML文件路径
 * @returns Promise 解析后的XML对象
 */
export function loadXml(
  xmlPath: string,
  options = {
    ignoreAttributes: true,
  },
): Promise<any> {
  try {
    // 同步读取文件内容
    const data = fs.readFileSync(xmlPath);
    const parser = new XMLParser(options);
    // 使用xml2js的同步解析方法
    const result = parser.parse(data);
    return result;
  } catch (error) {
    throw error;
  }
}
