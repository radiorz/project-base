import { select } from '@inquirer/prompts';
import { join } from 'path';
import { getTemplates } from './utils';
/**
 * @author
 * @file TemplateChooser.ts
 * @fileBase TemplateChooser
 * @path tools\create-tools\lib\TemplateChooser.ts
 * @from
 * @desc 为什么要creator manager 是因为有templates需要管理 而creator 只是针对一个templates 的管理
 * @example
 */

export interface TemplateChooserOptions {
  // 模板所在路径
  templatesDir: string;
}
// export class TemplateChooser {
//   static defaultOptions: TemplateChooserOptions = Object.freeze({
//     templatesPath: 'templates',
//   });
//   options: TemplateChooserOptions;
//   constructor(options?: Partial<TemplateChooserOptions>) {
//     this.options =
//   }
// }
export async function TemplateChooser(options?: Partial<TemplateChooserOptions>) {
  const opts = Object.assign({}, TemplateChooser.defaultOptions, options);
  const { templatesDir } = opts;
  const templates = await getTemplates(templatesDir);
  const templateName = await select({
    message: '模块名称',
    choices: templates.map((filePath) => ({
      value: filePath,
    })),
  });
  const templatePath = join(templatesDir, templateName);
  return templatePath;
}
TemplateChooser.defaultOptions = Object.freeze({
  templatesDir: 'templates',
}) as TemplateChooserOptions;
