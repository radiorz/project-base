import { listToNestedObject, ListToNestedObjectOptions, toCamelCase } from '@tikkhun/utils-core';
import yaml from 'js-yaml';
import JSON5 from 'json5';
import toml from 'toml';
import { convertXmlToConfig } from './xml';
import { readFile } from 'node:fs/promises';

export const loadJSON = async (filePath: string) => {
  const fileContent = await readFile(filePath, 'utf8');
  return JSON.parse(fileContent);
};
export const loadJSON5 = async (filePath: string) => {
  const fileContent = await readFile(filePath, 'utf8');
  return JSON5.parse(fileContent);
};
export const loadYaml = async (filePath: string) => {
  const fileContent = await readFile(filePath, 'utf8');
  return yaml.load(fileContent);
};
export const loadToml = async (filePath: string) => {
  const fileContent = await readFile(filePath, 'utf8');
  return toml.parse(fileContent);
};
export const loadEnvConfig = async (filePath: string, options?: Partial<ListToNestedObjectOptions>) => {
  const fileContent = await readFile(filePath, 'utf8');
  const envList = [] as { key: string; value: string }[];
  fileContent.split('\n').forEach((line) => {
    const [key, value] = line.split('=');
    if (key && value) {
      envList.push({ key, value });
    }
  });
  // TODO 这里好像没有对value进行转换？ nested args 可以上场
  const env = listToNestedObject({
    delimiter: '__',
    list: envList,
    keyItemTransformer: function (v: string): string {
      return toCamelCase(v);
    },
    ...options,
  });
  return env;
};
export async function loadFromXml(filePath: string, options?: any) {
  const fileContent = await readFile(filePath, 'utf8');
  const config = convertXmlToConfig(fileContent, options);
  return config;
}
