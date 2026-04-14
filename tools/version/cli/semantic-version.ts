#!/usr/bin/env node
import { Logger } from '@tikkhun/logger';
import { program } from 'commander';
import {
  DEFAULT_SEMANTIC_VERSION_GETTER_OPTIONS,
  Positions,
  SemanticVersionGetter,
  VersionManager,
} from '../lib';
import {
  loadVersionCliConfig,
  printManagerResult,
  printManagerValue,
  resolveTarget,
  TargetCommandOptions,
  resolveTargetFile,
} from './shared';
Logger.log('[欢迎] semantic-version');

/**
 * @description 语义化版本命令参数.
 */
interface SemanticVersionCommandOptions extends TargetCommandOptions {
  /**
   * @description 递增位置.
   */
  position: keyof typeof Positions;
  /**
   * @description 配置文件路径.
   */
  config?: string;
  /**
   * @description 是否只输出值.
   */
  valueOnly?: boolean;
}

program
  .command('update')
  .description('递增语义化版本并写入目标文件')
  .option(
    '-p --position <position>',
    '更新位置<major,minor,patch>',
    Positions[DEFAULT_SEMANTIC_VERSION_GETTER_OPTIONS.position],
  )
  .option('-c --config <configFile>', '版本配置文件路径')
  .option('-F --file <fileName>', '目标文件名称', DEFAULT_SEMANTIC_VERSION_GETTER_OPTIONS.file)
  .option('-t --type <type>', '目标文件类型', 'json')
  .option('-k --key <key>', '兼容旧版 key 参数', DEFAULT_SEMANTIC_VERSION_GETTER_OPTIONS.key)
  .option('--path <path>', '结构化路径')
  .option('--mode <mode>', '文本模式. raw 或 replace', 'raw')
  .option('--pattern <pattern>', '文本替换正则')
  .option('--replacement <replacement>', '文本替换模板', '{{version}}')
  .option('--create-if-not-exists', '文件不存在时自动创建', false)
  .action(async (options: SemanticVersionCommandOptions) => {
    const position = options.position as keyof typeof Positions;
    const versionManager = options.config
      ? await createVersionManagerByConfig(options.config, position)
      : createVersionManagerByOptions(options, position);
    const result = await versionManager.update();
    printManagerResult(result);
  });

program
  .command('get')
  .description('获取版本')
  .option('-p --position <position>', '更新位置', Positions[DEFAULT_SEMANTIC_VERSION_GETTER_OPTIONS.position])
  .option('-c --config <configFile>', '版本配置文件路径')
  .action(async (options: any) => {
    const position = options.position as keyof typeof Positions;
    const getter = options.config
      ? (await loadVersionCliConfig(options.config, position)).getter
      : new SemanticVersionGetter({ position: Positions[position] });
    if (!getter) {
      throw new Error('getter is required when using semantic-version get');
    }
    Logger.log(await getter.get());
  });

program
  .command('read')
  .description('读取目标文件中的当前版本')
  .option('-c --config <configFile>', '版本配置文件路径')
  .option('-F --file <fileName>', '目标文件名称', DEFAULT_SEMANTIC_VERSION_GETTER_OPTIONS.file)
  .option('-t --type <type>', '目标文件类型', 'json')
  .option('-k --key <key>', '兼容旧版 key 参数', DEFAULT_SEMANTIC_VERSION_GETTER_OPTIONS.key)
  .option('--path <path>', '结构化路径')
  .option('--mode <mode>', '文本模式. raw 或 replace', 'raw')
  .option('--pattern <pattern>', '文本替换正则')
  .option('--value-only', '只输出当前值', false)
  .action(async (options: SemanticVersionCommandOptions) => {
    const resolvedConfig = options.config ? await loadVersionCliConfig(options.config) : undefined;
    const versionManager = resolvedConfig
      ? new VersionManager({
          targets: resolvedConfig.targets,
        })
      : new VersionManager({
          targets: [resolveTarget(options)],
        });
    const result = await versionManager.read();
    if (options.valueOnly) {
      printManagerValue(result, resolvedConfig?.currentTargetIndex);
      return;
    }
    printManagerResult(result);
  });

program
  .command('set')
  .description('把指定版本值写入目标文件')
  .argument('<value>', '版本值')
  .option('-c --config <configFile>', '版本配置文件路径')
  .option('-F --file <fileName>', '目标文件名称', DEFAULT_SEMANTIC_VERSION_GETTER_OPTIONS.file)
  .option('-t --type <type>', '目标文件类型', 'json')
  .option('-k --key <key>', '兼容旧版 key 参数', DEFAULT_SEMANTIC_VERSION_GETTER_OPTIONS.key)
  .option('--path <path>', '结构化路径')
  .option('--mode <mode>', '文本模式. raw 或 replace', 'raw')
  .option('--pattern <pattern>', '文本替换正则')
  .option('--replacement <replacement>', '文本替换模板', '{{version}}')
  .option('--create-if-not-exists', '文件不存在时自动创建', false)
  .action(async (value: string, options: SemanticVersionCommandOptions) => {
    const resolvedConfig = options.config ? await loadVersionCliConfig(options.config) : undefined;
    const versionManager = resolvedConfig
      ? new VersionManager({
          targets: resolvedConfig.targets,
        })
      : new VersionManager({
          targets: [resolveTarget(options)],
        });
    const result = await versionManager.set(value);
    printManagerResult(result);
  });

program.parse(process.argv);

/**
 * @description 根据普通 CLI 参数创建版本管理器.
 * @param options CLI 参数.
 * @param positionKey 位置字符串.
 */
function createVersionManagerByOptions(options: SemanticVersionCommandOptions, positionKey: keyof typeof Positions) {
  const position = Positions[positionKey];
  const filePath = resolveTargetFile(options.file);
  return new VersionManager({
    getter: new SemanticVersionGetter({ position, file: filePath }),
    targets: [
      resolveTarget({
        ...options,
        file: filePath,
      }),
    ],
  });
}

/**
 * @description 根据配置文件创建版本管理器.
 * @param configFile 配置文件路径.
 * @param positionKey 位置字符串.
 */
async function createVersionManagerByConfig(configFile: string, positionKey: keyof typeof Positions) {
  const resolvedConfig = await loadVersionCliConfig(configFile, positionKey);
  if (!resolvedConfig.getter) {
    throw new Error('getter is required when using semantic-version update with config');
  }
  return new VersionManager({
    getter: resolvedConfig.getter,
    targets: resolvedConfig.targets,
  });
}
