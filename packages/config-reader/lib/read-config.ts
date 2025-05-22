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
import toml from 'toml';
import yaml from 'js-yaml';
import { createOverLoad } from '@tikkhun/overload';
import { execSync } from 'child_process';
export enum FILE_TYPES {
  javascript = 'javascript',
  json = 'json',
  json5 = 'json5',
  yaml = 'yaml',
  typescript = 'typescript',
  env = 'env',
  toml = 'toml',
}
export const readConfig = createOverLoad({
  getType(arg: any) {
    const filePath = arg;
    // 根据前缀判断
    if (filePath.startsWith('.env')) return FILE_TYPES.env;
    // 根据文件扩展名判断文件类型
    const ext = path.extname(filePath);
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
      default:
        console.error(`不支持的文件格式: ${ext}`);
        return null;
    }
  },
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
readConfig.addImpl(FILE_TYPES.toml, (filePath: string) => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return toml.parse(fileContent);
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
readConfig.addImpl(FILE_TYPES.javascript, async (filePath: string) => {
  // 动态加载 JS 文件
  // return (await import(filePath))?.default;
  const module = require(filePath);
  return require(filePath)?.default;
});
readConfig.addImpl(FILE_TYPES.typescript, function readTypeScriptConfig(filePath: string) {
  try {
    // 构造一个临时脚本，将目标 TypeScript 文件的导出对象序列化为 JSON 并打印
    const wrapperScript = `
      import config from '${filePath.replace(/'/g, "\\'")}';
      console.log(JSON.stringify(config));
    `;

    // 使用 execSync 执行 tsx 命令并获取输出
    const output = execSync(`npx tsx -e "${wrapperScript.replace(/"/g, '\\"')}" --no-check`).toString();

    // 解析输出为 JSON 对象
    return JSON.parse(output);
  } catch (err) {
    console.error(`执行 tsx 命令失败或解析输出失败: ${filePath}`, err);
    return null;
  }
});
