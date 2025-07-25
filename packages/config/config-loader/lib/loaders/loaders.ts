import { listToNestedObject, ListToNestedObjectOptions, toCamelCase } from '@tikkhun/utils-core';
import { load as parseYaml } from 'js-yaml';
import JSON5 from 'json5';
const { parse: parseJSON5 } = JSON5;
import { parse as parseToml } from 'smol-toml';
import { convertXmlToConfig } from './xml';
// import { readLocalOrUrlFile as readFile } from '@tikkhun/utils';
import { readFile } from 'node:fs/promises';
import { asyncPipe } from '@tikkhun/pipe';
// 这里应该搞一个 pipe 反正就是filePath -> fileContent -> config 的一种方式，搞个pipe看着更清楚
// TODO filePath 之后可以用fetch支持网络文件，然后以 file:// 开头的可以用new Url包装一下
export const loadJSON = async (filePath: string) => {
  return asyncPipe((f: string) => readFile(f, 'utf8'), JSON.parse)(filePath);
  // const fileContent = await readFile(filePath, 'utf8');
  // return JSON.parse(fileContent);
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
