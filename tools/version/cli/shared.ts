import { Logger } from '@tikkhun/logger';
import { findUp } from '@tikkhun/utils';
import { readJson } from 'fs-extra';
import path from 'node:path';
import { Positions, SemanticVersionGetter, VersionManagerResult, VersionTarget } from '../lib';

/**
 * @description CLI 目标参数.
 */
export interface TargetCommandOptions {
  /**
   * @description 目标文件路径.
   */
  file: string;
  /**
   * @description 目标文件类型.
   */
  type: VersionTarget['type'];
  /**
   * @description 结构化路径.
   */
  path?: string;
  /**
   * @description 兼容旧版 key 参数.
   */
  key?: string;
  /**
   * @description 文本模式.
   */
  mode?: 'raw' | 'replace';
  /**
   * @description 文本替换正则.
   */
  pattern?: string;
  /**
   * @description 文本替换模板.
   */
  replacement?: string;
  /**
   * @description 读取文本时是否 trim.
   */
  trim?: boolean;
  /**
   * @description 文件不存在时是否创建.
   */
  createIfNotExists?: boolean;
}

/**
 * @description 语义化版本 getter 配置.
 */
export interface SemanticGetterConfig {
  /**
   * @description getter 类型.
   */
  type: 'semantic';
  /**
   * @description 版本源文件路径.
   */
  file: string;
  /**
   * @description 版本字段 key.
   */
  key?: string;
  /**
   * @description 递增位置.
   */
  position?: keyof typeof Positions;
}

/**
 * @description 版本配置文件结构.
 */
export interface VersionCliConfig {
  /**
   * @description getter 配置.
   */
  getter?: SemanticGetterConfig;
  /**
   * @description 版本目标列表.
   */
  targets: TargetCommandOptions[];
  /**
   * @description 读取单值时使用的目标索引.
   */
  currentTargetIndex?: number;
}

/**
 * @description 解析后的配置结果.
 */
export interface ResolvedVersionCliConfig {
  /**
   * @description 语义化版本 getter.
   */
  getter?: SemanticVersionGetter;
  /**
   * @description 目标列表.
   */
  targets: VersionTarget[];
  /**
   * @description 当前值目标索引.
   */
  currentTargetIndex: number;
}

/**
 * @description 解析 CLI 文件路径.
 * @param file 文件路径.
 */
export function resolveTargetFile(file: string, baseDir: string = process.cwd(), enableFindUp: boolean = true): string {
  if (path.isAbsolute(file)) {
    return file;
  }
  if (enableFindUp) {
    return findUp(file, baseDir) ?? path.resolve(baseDir, file);
  }
  return path.resolve(baseDir, file);
}

/**
 * @description 把 CLI 参数转换成目标配置.
 * @param options CLI 参数.
 */
export function resolveTarget(
  options: TargetCommandOptions,
  baseDir: string = process.cwd(),
  enableFindUp: boolean = true,
): VersionTarget {
  const file = resolveTargetFile(options.file, baseDir, enableFindUp);
  if (options.type === 'text') {
    return {
      type: 'text',
      file,
      mode: options.mode ?? 'raw',
      pattern: options.pattern,
      replacement: options.replacement,
      trim: options.trim ?? true,
      createIfNotExists: options.createIfNotExists,
    };
  }
  if (options.type === 'custom') {
    throw new Error('cli does not support custom target directly');
  }
  return {
    type: options.type,
    file,
    path: options.path ?? options.key ?? 'version',
    createIfNotExists: options.createIfNotExists,
  };
}

/**
 * @description 加载版本配置文件.
 * @param configFile 配置文件路径.
 * @param positionOverride 可选的位置覆盖.
 */
export async function loadVersionCliConfig(
  configFile: string,
  positionOverride?: keyof typeof Positions,
): Promise<ResolvedVersionCliConfig> {
  const resolvedConfigFile = resolveTargetFile(configFile);
  const configDir = path.dirname(resolvedConfigFile);
  const config = (await readJson(resolvedConfigFile)) as VersionCliConfig;
  const targets = (config.targets ?? []).map((target) => resolveTarget(target, configDir, false));
  const currentTargetIndex = config.currentTargetIndex ?? 0;
  if (!config.getter) {
    return {
      targets,
      currentTargetIndex,
    };
  }
  if (config.getter.type !== 'semantic') {
    throw new Error(`unsupported getter type: ${config.getter.type}`);
  }
  const getter = new SemanticVersionGetter({
    file: resolveTargetFile(config.getter.file, configDir, false),
    key: config.getter.key ?? 'version',
    position: Positions[positionOverride ?? config.getter.position ?? 'patch'],
  });
  return {
    getter,
    targets,
    currentTargetIndex,
  };
}

/**
 * @description 打印结果中的单个值.
 * @param result 聚合结果.
 * @param currentTargetIndex 当前目标索引.
 */
export function printManagerValue(result: VersionManagerResult, currentTargetIndex: number = 0) {
  const targetResult = result.results[currentTargetIndex] ?? result.results.find((item) => item.success);
  const value = targetResult && 'value' in targetResult ? targetResult.value : '';
  Logger.log(String(value ?? ''));
}

/**
 * @description 打印版本管理结果.
 * @param result 聚合结果.
 */
export function printManagerResult(result: VersionManagerResult) {
  Logger.log(JSON.stringify(result, null, 2));
}
