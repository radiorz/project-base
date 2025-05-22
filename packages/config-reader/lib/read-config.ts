/**
 * @function readConfig
 * @description 函数用于
 * @param
 * @returns
 * @example
 * readConfig() // ->
 */
import fs from 'fs';
import path from 'path';
import JSON5 from 'json5';
import yaml from 'js-yaml';
import ts from 'typescript';

export function readConfig(file_path: string) {
  const ext = path.extname(file_path);
  let content;

  try {
    content = fs.readFileSync(file_path, 'utf8');
  } catch (err) {
    console.error(`读取文件失败: ${file_path}`, err);
    return null;
  }

  try {
    switch (ext) {
      case '.js':
        // 动态加载 JS 文件
        return require(file_path);
      case '.json':
        return JSON.parse(content);
      case '.json5':
        return JSON5.parse(content);
      case '.yaml':
      case '.yml':
        return yaml.load(content);
      case '.ts':
        return readTypeScriptConfig(file_path);
      default:
        console.error(`不支持的文件格式: ${ext}`);
        return null;
    }
  } catch (err) {
    console.error(`解析文件失败: ${file_path}`, err);
    return null;
  }
}
function readTypeScriptConfig(filePath: string) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const parsed = ts.transpileModule(fileContent, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
    fileName: filePath,
  }).outputText;
  return eval(parsed); // 使用 eval 运行转译后的代码并获取配置对象
}
