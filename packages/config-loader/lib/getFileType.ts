import { basename, extname } from 'node:path';
import { FILE_TYPES } from './type';

export function getFileType(filePath: string) {
  if (typeof filePath !== 'string') {
    throw new Error('filePath必须是字符串');
  }
  const fileBaseName = basename(filePath);
  // 根据前缀判断
  if (fileBaseName.startsWith('.env')) return FILE_TYPES.env;
  // 根据文件扩展名判断文件类型
  const ext = extname(fileBaseName);
  switch (ext) {
    case '.toml':
      return FILE_TYPES.toml;
    case '.mjs':
    case '.js':
    case '.cjs':
      // 动态加载 JS 文件
      return FILE_TYPES.javascript;
    case '.json':
      return FILE_TYPES.json;
    case '.json5':
      return FILE_TYPES.json5;
    case '.yaml':
    case '.yml':
      return FILE_TYPES.yaml;
    case '.ts':
    case '.mts':
    case '.cts':
      return FILE_TYPES.typescript;
    case '.xml':
      return FILE_TYPES.xml;
    case '.xlsx':
      return FILE_TYPES.sheet;
    default:
      console.error(`文件的格式不受支持: ${filePath}`);
      return null;
  }
}
