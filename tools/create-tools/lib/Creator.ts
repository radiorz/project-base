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
import { Logger } from '@tikkhun/logger';
import { copy, readFile, writeFile, remove, move } from 'fs-extra';
const logger = new Logger('Creator');
export interface ReplaceDir {
  sourcePath: string;
  targetPath: string;
}
export interface Options {
  workspace: string;
  projectName: string;

  template: string;
  templateExclude: string[];
  templateFiles: string[];
  replaces: ReplaceDir[];
}
export const DEFAULT_OPTIONS: Options = {
  workspace: process.cwd(), // template 复制到的位置
  template: './template', // template 的位置
  templateExclude: ['.git', 'node_modules', 'dist'], // 排除不复制的内容
  projectName: 'project-name', // 项目名称
  templateFiles: ['package.json'], // 根据文件路径定位
  replaces: [],
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
    // TODO 如果有文件需要先询问
    try {
      logger.log(`[开始] 创建项目的选项为： ` + JSON.stringify(this.options, null, 2));
      await this.clear(); // 先清除
      logger.log('[开始] 拷贝到项目中' + this.projectDir);
      await copy(this.options.template, this.projectDir, {
        filter: (src: string) => {
          for (const exclude of this.options.templateExclude) {
            if (src.includes(exclude)) return false;
          }
          return true;
        },
      });
      logger.log('[完毕] 拷贝到项目中' + this.projectDir);
      if (this.options.templateFiles?.length) {
        for (const file of this.options.templateFiles) {
          if (!file) {
            continue;
          }
          logger.log('[开始] 替换文件' + file);
          await replaceText(join(this.projectDir, file), this.options);
          logger.log('[完毕] 替换文件' + file);
        }
      }
      if (this.options.replaces?.length) {
        const replaces = this.options.replaces.filter((a) => a);
        for (const { sourcePath, targetPath } of replaces) {
          if (!sourcePath || !targetPath) {
            continue;
          }
          logger.log('[开始] 迁移文件' + sourcePath + '=>' + targetPath);
          await move(join(this.projectDir, sourcePath), join(this.projectDir, targetPath));
          logger.log('[完毕] 迁移文件' + sourcePath + '=>' + targetPath);
        }
      }
    } catch (error: any) {
      logger.error('[失败] 创建项目失败' + error.stack);
      // await this.clear()
    }
  }
  async clear() {
    logger.log('[开始] 删除项目文件' + this.projectDir);
    await remove(this.projectDir);
    logger.log('[完毕] 删除项目文件' + this.projectDir);
  }
}
async function replaceText(filepath: string, context: any) {
  let text = (await readFile(filepath)).toString();
  text = ejs.render(text, context);
  await writeFile(filepath, text);
}
