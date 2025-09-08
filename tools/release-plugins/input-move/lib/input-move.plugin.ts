// 导入需要的类型
import type { AfterInputGot, Release } from '@tikkhun/release-core';
// 导入工具函数
import { mergeOptions } from '@tikkhun/utils-core';
// 导入 Node.js 文件系统相关模块
import { stat } from 'node:fs/promises';
// 导入路径处理相关函数
import { isAbsolute } from 'node:path';
import { join } from 'path';

// 定义单个文件移动选项接口
export interface InputMoveOption {
  source: string; // 源文件路径
  target: string; // 目标文件路径
  allowError?: boolean; // 是否允许错误
}

// 定义插件配置选项接口
export interface InputMovePluginOptions {
  items: InputMoveOption[]; // 文件移动配置项列表
}

// 创建文件移动插件类，实现 AfterInputGot 接口
export class InputMovePlugin implements AfterInputGot {
  // 定义插件的默认选项并冻结（不可修改）
  static defaultOptions: InputMovePluginOptions = Object.freeze({
    items: [], // 默认没有需要移动的文件
  });

  // 存储插件的实际配置选项
  options: InputMovePluginOptions;

  // 构造函数，合并用户配置与默认配置
  constructor(options: Partial<InputMovePluginOptions>) {
    this.options = mergeOptions(InputMovePlugin.defaultOptions, options);
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
        .filter((option) => option?.source)
        // 对每个有效的配置项执行移动操作
        .map(async (option) => {
          try {
            // 确定源文件的绝对路径
            const sourcePath = isAbsolute(option.source)
              ? option.source
              : join(release.options.workspace, option.source);

            // 记录移动操作的日志
            release.log.log(
              `[plugin/移动文件文件夹] 将文件加入压缩包中，源路径为: ${sourcePath}, 移动为: ${option.target}`,
            );

            // 获取源文件的状态信息
            const fileStat = await stat(sourcePath);

            // 如果源路径是目录
            if (fileStat.isDirectory()) {
              // 查找所有以该目录开头的输入文件
              const inputs = release.inputs.filter((input) => input.source.startsWith(option.source));
              // 如果没有找到匹配的文件，则返回
              if (!inputs.length) {
                release.log.warn(`[plugin/移动文件文件夹] 没有找到匹配的文件，源路径为: ${sourcePath}`);
                return;
              }
              release.log?.debug?.(`[plugin/移动文件文件夹] 匹配到文件数量: ${inputs.length}`);

              // 遍历所有匹配的文件并修改它们的名称（路径）
              inputs.forEach((input) => {
                // 使用正则表达式替换文件路径的开头部分
                input.name = input.name.replace(new RegExp('^' + option.source), option.target);
              });
            }
            // 如果源路径是文件
            else if (fileStat.isFile()) {
              // 查找匹配的输入文件
              const input = release.inputs.find((input) => input.source === option.source);
              // 如果没有找到匹配的文件，则返回
              if (!input) {
                release.log.warn(`[plugin/移动文件文件夹] 没有找到匹配的文件，源路径为: ${sourcePath}`);
                return;
              }
              // 修改文件的名称（路径）为目标路径
              input.name = option.target;
            }
          } catch (error) {
            release.log.error(`[plugin/移动文件文件夹] 移动文件失败,源路径为: ${option.source}, 错误信息: ${error}`);
            if (!option.allowError) {
              throw error;
            }
          }
        }),
    );
  }
}
