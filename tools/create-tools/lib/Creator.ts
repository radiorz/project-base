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
import { Logger } from '@tikkhun/logger';
import ejs from 'ejs';
import fsExtra from 'fs-extra';
import { mergeOptions } from '@tikkhun/utils-core';
import { minimatch } from 'minimatch';
import { join } from 'path';
import { templatesDir } from './utils';
const { copy, readFile, writeFile, remove, move, pathExists } = fsExtra;
const logger = new Logger('Creator');

export interface ReplaceDir {
  sourcePath: string;
  targetPath: string;
}
export interface ProjectDirOptions {
  prefix: string;
  suffix: string;
  delimiter: string;
  build: (name: string, options: Omit<ProjectDirOptions, 'build'>) => string;
}
export interface CreatorOptions {
  // 项目的目标目录
  workspace: string;
  // 清空旧的
  clean: boolean;
  // 项目名称
  projectName: string;
  // templates: string[];
  // 项目模板路径
  template: string;
  // 排除复制的文件
  templateExclude: string[];
  // ejs 模板文件
  templateFiles: string[];
  // 需要移动的文件配置
  replaces: ReplaceDir[];
  //
  projectDirOptions: ProjectDirOptions;
}
let libDir: string;
export class Creator {
  static DEFAULT_OPTIONS: CreatorOptions = {
    workspace: process.cwd(), // template 复制到的位置
    clean: true,
    template: join(templatesDir, 'default'), // template 的位置
    templateExclude: ['.git', 'node_modules', 'dist'], // 排除不复制的内容
    projectName: 'project-name', // 项目名称
    templateFiles: ['package.json', 'README.md'], // 根据文件路径定位
    replaces: [],
    projectDirOptions: {
      prefix: '',
      suffix: '',
      delimiter: '',
      build: getProjectDirName,
    },
  };
  options: CreatorOptions;
  get projectDir() {
    return join(
      this.options.workspace,
      this.options.projectDirOptions.build(this.options.projectName, this.options.projectDirOptions),
    );
  }
  constructor(options?: Partial<CreatorOptions>) {
    this.options = mergeOptions(Creator.DEFAULT_OPTIONS, options);
  }
  async start() {
    try {
      logger.log(`[开始] 创建项目, 选项为： ` + JSON.stringify(this.options, null, 2));
      let template = this.options.template;
      // 检查template目录有咩
      const isTemplateExist = await pathExists(template);
      if (!isTemplateExist) {
        throw new Error('模板路径不存在: ' + template);
      }
      await this.clear(); // 先清除
      logger.log('[开始] 拷贝模板到项目中 ' + this.projectDir);
      const templatePath = template.replace(/\\\\/g, '/').replace(/^\.\//, '');
      await copy(template, this.projectDir, {
        filter: (src: string) => {
          // 排除根文件
          if (template === src) {
            return true;
          }
          // template 是 \\
          // 但具体到每一个文件是一个 \ 的
          // 统一使用 / 做分割符号
          const theRelativePath = removePrefix(src.replace(/\\/g, '/'), templatePath + '/');
          if (theRelativePath) {
            for (const exclude of this.options.templateExclude) {
              if (minimatch(theRelativePath, exclude)) return false;
            }
          }
          return true;
        },
      });
      logger.log('[完毕] 拷贝模板到项目中 ' + this.projectDir);
      if (this.options.templateFiles?.length) {
        const templateFiles = this.options.templateFiles.filter((f) => f);
        await Promise.all(
          templateFiles.map(async (file) => {
            return await replaceText(join(this.projectDir, file), this.options);
          }),
        );
      }
      if (this.options.replaces?.length) {
        const replaces = this.options.replaces.filter((r) => {
          if (!r) return false;
          return r.sourcePath && r.targetPath;
        });
        // 这里可能存在先后顺序 所以使用for循环
        for (const { sourcePath, targetPath } of replaces) {
          logger.log('[开始] 迁移文件 ' + sourcePath + ' => ' + targetPath);
          const _source = join(this.projectDir, sourcePath);
          if (!(await pathExists(_source))) {
            logger.log('[出错] 迁移文件,但文件不存在 ' + sourcePath + ' =>' + targetPath);
            continue;
          }
          await move(_source, join(this.projectDir, targetPath));
          logger.log('[完毕] 迁移文件 ' + sourcePath + ' => ' + targetPath);
        }
      }
      logger.log('[完毕] 创建项目 ' + this.projectDir);
    } catch (error: any) {
      logger.error('[失败] 创建项目失败 ' + error.stack);
      // await this.clear()
    }
  }
  async clear() {
    if (!this.options.clean) {
      return;
    }
    logger.log('[开始] 删除项目文件 ' + this.projectDir);
    await remove(this.projectDir);
    logger.log('[完毕] 删除项目文件 ' + this.projectDir);
  }
}
function getProjectDirName(name: string, options: Omit<ProjectDirOptions, 'build'>) {
  return [options.prefix, name, options.suffix].join(options.delimiter);
}
async function replaceText(filepath: string, context: any) {
  try {
    logger.debug!('[开始] 替换模板文本 ' + filepath);
    let text = (await readFile(filepath)).toString();
    text = ejs.render(text, context);
    await writeFile(filepath, text);
    logger.debug!('[完毕] 替换模板文本 ' + filepath);
    return true;
  } catch (e) {
    logger.error('[错误] 替换模板文本 ' + filepath);
    return false;
  }
}
function removePrefix(str: string, prefix: string) {
  return str.startsWith(prefix) ? str.slice(prefix.length) : str;
}
