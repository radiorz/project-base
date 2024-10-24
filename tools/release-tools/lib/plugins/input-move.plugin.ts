import { optionsMerge } from '@tikkhun/utils-core';
import { AfterInputGot, BeforeInputGot } from './plugin.interface';
import { Release } from '../release';
import { Archiver } from 'archiver';
import { join } from 'path';
import { stat } from 'node:fs/promises';
import { glob } from 'glob';
export interface InputMoveOption {
  source: string; // 源文件
  target: string; // 目标文件
}
export interface InputMovePluginOptions {
  items: InputMoveOption[];
  // directory
}
export class InputMovePlugin implements AfterInputGot {
  static defaultOptions: InputMovePluginOptions = Object.freeze({
    // 可能是 directory 可能 是 files
    items: [],
  });
  options: InputMovePluginOptions;
  constructor(options: Partial<InputMovePluginOptions>) {
    this.options = optionsMerge(InputMovePlugin.defaultOptions, options);
  }
  async afterInputGot(release: Release) {
    if (!this.options.items?.length) {
      return;
    }
    return await Promise.all(
      this.options.items.map(async (option) => {
        release.log.log(
          `[plugin/移动文件文件夹] 将文件加入压缩包中，源路径为: ${join(release.options.workspace, option.source)}, 移动为: ${option.target}`,
        );
        const fileStat = await stat(option.source);
        if (fileStat.isDirectory()) {
          const inputs = release.inputs.filter((input) => input.source.startsWith(option.source));
          if (!inputs) {
            return;
          }
          inputs.forEach((input) => {
            input.name = input.name.replace(new RegExp('^' + option.source), option.target);
          });
        } else if (fileStat.isFile()) {
          const input = release.inputs.find((input) => input.source === option.source);
          if (!input) {
            return;
          }
          // 可变得修改
          input.name = option.target;
        }
      }),
    );
  }
}
