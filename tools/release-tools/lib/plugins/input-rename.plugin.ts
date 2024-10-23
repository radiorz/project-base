import { optionsMerge } from '@tikkhun/utils-core';
import { AfterInputGot, BeforeInputGot } from './plugin.interface';
import { Release } from '../Release';
import { Archiver } from 'archiver';
import { join } from 'path';
export interface InputRenameOption {
  source: string; // 源文件
  target: string; // 目标文件
}
export interface InputRenamePluginOptions {
  files: InputRenameOption[];
  // directory
}
export class InputRenamePlugin implements AfterInputGot, BeforeInputGot {
  static defaultOptions: InputRenamePluginOptions = Object.freeze({
    files: [],
  });
  options: InputRenamePluginOptions;
  constructor(options: Partial<InputRenamePluginOptions>) {
    this.options = optionsMerge(InputRenamePlugin.defaultOptions, options);
  }
  beforeInputGot(release: Release): void {
    const excludeGlobFiles = this.options.files.map((option) => option.source);
    release.options.exclude = [...release.options.exclude, ...excludeGlobFiles];
    release.log.log(`[plugin] [重命名文件]将原本的文件排除 ${JSON.stringify(excludeGlobFiles)}`);
  }
  afterInputGot(release: Release, archive: Archiver): void {
    if (!this.options.files?.length) {
      return;
    }
    // TODO 这个source 应该在exclude中被排除
    this.options.files.forEach((option) => {
      release.log.log(
        `[plugin] [重命名文件]将文件加入压缩包中，源文件为: ${join(release.options.workspace, option.source)},重命名为: ${option.target}`,
      );
      // TODO file 支持glob
      // TODO 支持directory
      archive.file(join(release.options.workspace, option.source), { name: option.target });
    });
  }
}
