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
import { createOverLoad } from '@tikkhun/overload';
import { execSync } from 'child_process';
enum FILE_TYPES {
  javascript = 'javascript',
  json = 'json',
  json5 = 'json5',
  yaml = 'yaml',
  typescript = 'typescript',
  env = 'env',
}
export const readConfig = createOverLoad({
  getType(arg: any) {
    const filePath = arg;
    // 根据前缀判断
    if (filePath.startsWith('.env')) return FILE_TYPES.env;
    // 根据文件扩展名判断文件类型
    const ext = path.extname(filePath);
    switch (ext) {
      case '.js':
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
        return FILE_TYPES.typescript;
      default:
        console.error(`不支持的文件格式: ${ext}`);
        return null;
    }
  },
});
readConfig.addImpl(FILE_TYPES.javascript, (filePath: string) => {
  // 动态加载 JS 文件
  return require(filePath);
});
readConfig.addImpl(FILE_TYPES.json, (filePath: string) => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContent);
});
readConfig.addImpl(FILE_TYPES.json5, (filePath: string) => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return JSON5.parse(fileContent);
});
readConfig.addImpl(FILE_TYPES.yaml, (filePath: string) => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return yaml.load(fileContent);
});
readConfig.addImpl(FILE_TYPES.env, (filePath: string) => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const env = {} as Record<string, string>;
  fileContent.split('\n').forEach((line) => {
    const [key, value] = line.split('=');
    if (key && value) {
      env[key] = value;
    }
  });
  return env;
});
readConfig.addImpl(FILE_TYPES.typescript, function readTypeScriptConfig(filePath: string) {
  try {
    // 使用 execSync 执行 tsx 命令并获取输出
    const output = execSync(`npx tsx ${filePath} --no-check`).toString();
    // 尝试将输出解析为 JSON
    return JSON.parse(output);
  } catch (err) {
    console.error(`执行 tsx 命令失败或解析输出失败: ${filePath}`, err);
    return null;
  }
});
