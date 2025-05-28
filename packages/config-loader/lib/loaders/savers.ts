import { Config } from '../type';
import { writeFile } from 'node:fs/promises';
import yaml from 'js-yaml';
// import JSON5 from 'json5';
// import toml from 'toml';
import { convertConfigToXml } from './xml';
export function saveToJson(data: Config, filePath: string) {
  writeFile(filePath, JSON.stringify(data, null, 2));
}
export function saveToYaml(data: Config, filePath: string) {
  const content = yaml.dump(data);
  writeFile(filePath, content);
}

export function saveToToml(data: Config, filePath: string) {}
export function saveToEnv(data: Config, filePath: string) {}
// export function saveToJs(data: Config, filePath: string) {}
export function saveToJsLike(data: Config, filePath: string) {
  const content = `export default ${JSON.stringify(data, null, 2)}`;
  writeFile(filePath, content);
}
export function saveToXml(data: Config, filePath: string) {
  const content = convertConfigToXml(data);
  writeFile(filePath, content);
}
