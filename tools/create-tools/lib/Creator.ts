/**
 * @author
 * @file Creator.ts
 * @fileBase Creator
 * @path tools\create-tools\lib\Creator.ts
 * @from
 * @desc
 * @todo
 *
 *
 * @done
 * @example
 */
import { join } from 'path';
import ejs from 'ejs';

import { copy, readFile, writeFile, readJson, writeJson } from 'fs-extra';
import { checkNodeVersion } from './node';
export interface Options {
  workspace: string;
  template: string;
  projectName: string;

  templateExclude: string[];
  templateFiles: string[];
}
export const DEFAULT_OPTIONS: Options = {
  workspace: process.cwd(), // template 复制到的位置
  template: './template', // template 的位置
  templateExclude: ['.git', 'node_modules'], // 排除不复制的内容
  projectName: 'project-name', // 项目名称
  templateFiles: ['package.json'], // 根据文件路径定位
};
export class Creator {
  options: Options;
  get projectDir() {
    return join(this.options.workspace, this.options.projectName);
  }
  constructor(options?: Partial<Options>) {
    this.options = Object.assign(DEFAULT_OPTIONS, options);
  }
  async start() {
    await copy(this.options.template, this.options.projectName);
    for (const file of this.options.templateFiles) {
      await replaceText(file, this.options);
    }
  }
}
async function replaceText(filepath: string, context: any) {
  let text = (await readFile(filepath)).toString();
  text = ejs.render(text, context);
  await writeFile(filepath, text);
}
