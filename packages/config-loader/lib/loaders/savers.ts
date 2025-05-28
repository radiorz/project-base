import { Config } from '../type';
import { writeFile } from 'node:fs/promises';
import yaml from 'js-yaml';
// import JSON5 from 'json5';
// import toml from 'toml';
import { convertConfigToXml } from './xml';
import { nestedObjectToList, NestedObjectToListOptions } from '@tikkhun/utils-core';
export function saveToJson(data: Config, filePath: string) {
  writeFile(filePath, JSON.stringify(data, null, 2));
}
export function saveToYaml(data: Config, filePath: string) {
  const content = yaml.dump(data);
  writeFile(filePath, content);
}
import toml from 'smol-toml';

export function saveToToml(data: Config, filePath: string) {
  const content = toml.stringify(data);
  writeFile(filePath, content);
}
export function saveToEnv(data: Config, filePath: string, options?: Partial<NestedObjectToListOptions>) {
  // TODO 这里好像没有对value进行转换？ nested args 可以上场
  const env = nestedObjectToList({
    delimiter: '__',
    json: data,
    // keyItemTransformer: function (v: string): string {
    //   return to(v);
    // },
    ...options,
  });
  writeFile(filePath, env.map((item) => `${item.key}=${item.value}`).join('\n'));
}
// export function saveToJs(data: Config, filePath: string) {}
export function saveToJsLike(data: Config, filePath: string) {
  const content = `export default ${JSON.stringify(data, null, 2)}`;
  writeFile(filePath, content);
}
export async function saveToXml(data: Config, filePath: string) {
  const content = await convertConfigToXml(data);
  writeFile(filePath, content);
}
