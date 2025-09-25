// 导入需要的类型
import type { AfterInputGot, Release } from '@tikkhun/release-core';
// 导入工具函数
import { mergeOptions } from '@tikkhun/utils-core';
// 导入 Node.js 文件系统相关模块
import { stat } from 'node:fs/promises';
// 导入路径处理相关函数
import { isAbsolute } from 'node:path';
import { join } from 'path';
// 导入 glob 用于文件匹配
import { glob } from 'glob';
import { workspace } from '../../../version/lib/utils';

export const pluginName = '添加输入插件';
// 定义单个文件移动选项接口
export interface InputAddOption {
  workspace?: string, // 工作空间路径
  include: string[]; // 源文件路径
  exclude?: string[]; // 忽略的文件路径
  target: string; // 目标文件路径
  allowError?: boolean; // 是否允许错误
}

// 定义插件配置选项接口
export interface InputAddPluginOptions {
  items: InputAddOption[]; // 文件移动配置项列表
}

// 创建文件移动插件类，实现 AfterInputGot 接口
export class InputAddPlugin implements AfterInputGot {
  // 定义插件的默认选项并冻结（不可修改）
  static defaultOptions: InputAddPluginOptions = Object.freeze({
    items: [], // 默认没有需要移动的文件
  });

  // 存储插件的实际配置选项
  options: InputAddPluginOptions;

  // 构造函数，合并用户配置与默认配置
  constructor(options: Partial<InputAddPluginOptions>) {
    this.options = mergeOptions(InputAddPlugin.defaultOptions, options);
  }

  // 实现 AfterInputGot 接口的方法，在获取输入文件后执行
  async afterInputGot(release: Release) {
    // 如果没有配置文件移动项，则直接返回
    if (!this.options.items?.length) {
      return;
    }

    // 并行处理所有文件移动配置项
    return await Promise.all(
      // 过滤掉没有源路径的配置项
      this.options.items
        .filter((option) => option?.include)
        .map(async (option) => {
          try {
            // 记录移动操作的日志
            release.log.log(
              `[plugin/${pluginName}] 将文件加入压缩包中，源路径为: ${option.include}, 移动为: ${option.target}`,
            );
            // 使用 glob 获取目录下所有文件
            const sources = await glob(option.include, {
              cwd: option.workspace ?? release.options.workspace,// 没有workspace就用 release本身的
              ignore: option.exclude,
              dot: true
            });
            release.log.log(`[plugin/${pluginName}] 使用glob匹配到文件数量: ${sources.length}`);
            if (!sources.length) {
              return
            }
            // 添加source
            release.inputs = [...release.inputs, ...sources.map(source => {
              const relativePath = source.replace(option.workspace ?? release.options.workspace, '').replace(/^\//, '');
              return ({
                source: source,
                name: join(option.target, relativePath).replace(/\\/g, '/')
              })
            })]
          } catch (error) {
            release.log.error(`[plugin/${pluginName}] 移动文件失败,配置为: ${JSON.stringify(option)}, 错误信息: ${error}`);
            if (!option.allowError) {
              throw error;
            }
          }
        }),
    );
  }
}
