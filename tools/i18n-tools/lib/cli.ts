import { program } from 'commander';

import { Logger } from '@tikkhun/logger';
import packageJson from '../package.json';
import { readJson, writeFile } from 'fs-extra';
import { join } from 'path';
import { jsonToList } from '@tikkhun/utils-core';
const name = packageJson.name;
interface ListOptions {
  path: string;
  savePath: string;
}
const DEFAULT_LIST_OPTIONS: ListOptions = {
  path: join(process.cwd(), 'locale/zh.json'),
  savePath: join(process.cwd(), 'locale/zh.txt'),
};
Logger.log(`[欢迎使用] ${name}`);
program
  .description('list')
  .option('--path <path>', 'json文件路径', DEFAULT_LIST_OPTIONS.path)
  .option('--savePath <savePath>', 'json文件路径', DEFAULT_LIST_OPTIONS.savePath)
  .action(async (options: ListOptions) => {
    const json = await readJson(options.path);
    const list = jsonToList({
      delimiter: '.',
      json,
    });
    const content = list
      .map(({ key, value }) => {
        return `${key}=${value}`;
      })
      .join('\n');
    await writeFile(options.savePath, content);
  });
program.parse(process.argv);
