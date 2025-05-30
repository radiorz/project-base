import { listToNestedObject, ListToNestedObjectOptions, toCamelCase } from '@tikkhun/utils-core';
import { load as parseYaml } from 'js-yaml';
import { parse as parseJSON5 } from 'json5';
import { parse as parseToml } from 'smol-toml';
import { convertXmlToConfig } from './xml';
// import { readLocalOrUrlFile as readFile } from '@tikkhun/utils';
import { readFile } from 'node:fs/promises';
export const loadJSON = async (filePath: string) => {
  const fileContent = await readFile(filePath, 'utf8');
  return JSON.parse(fileContent);
};
export const loadJSON5 = async (filePath: string) => {
  const fileContent = await readFile(filePath, 'utf8');
  return parseJSON5(fileContent);
};
export const loadYaml = async (filePath: string) => {
  const fileContent = await readFile(filePath, 'utf8');
  return parseYaml(fileContent);
};
export const loadToml = async (filePath: string) => {
  const fileContent = await readFile(filePath, 'utf8');
  return parseToml(fileContent);
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
