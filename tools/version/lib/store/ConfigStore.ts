import { ensureFile, pathExists, readFile, writeFile } from 'fs-extra';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import yaml from 'js-yaml';
import { get as getByPath, set as setByPath } from 'lodash';
import { parse as parseToml, stringify as stringifyToml } from 'smol-toml';
import { Store, StoreGetResult, StoreSetResult, StructuredVersionTarget, VersionValue } from './Store';

/**
 * @description 结构化配置 store.
 */
export class ConfigStore implements Store {
  /**
   * @description 当前 store 绑定的目标.
   */
  target: StructuredVersionTarget;

  /**
   * @description 初始化结构化配置 store.
   * @param target 目标配置.
   */
  constructor(target: StructuredVersionTarget) {
    this.target = target;
  }

  /**
   * @description 读取结构化文件里的版本值.
   */
  async get(): Promise<StoreGetResult> {
    try {
      if (!(await pathExists(this.target.file))) {
        return this.createGetError(`file is not found: ${this.target.file}`);
      }
      const config = await this.loadStructuredConfig();
      const value = this.target.path ? getByPath(config, this.target.path) : config;
      if (value === undefined) {
        return this.createGetError(`path is not found: ${this.target.path ?? '<root>'}`);
      }
      if (typeof value !== 'string' && typeof value !== 'number') {
        return this.createGetError(`value is not string or number: ${JSON.stringify(value)}`);
      }
      return {
        action: 'get',
        success: true,
        file: this.target.file,
        type: this.target.type,
        value,
      };
    } catch (error) {
      return this.createGetError(this.getErrorMessage(error));
    }
  }

  /**
   * @description 写入结构化文件里的版本值.
   * @param value 版本值.
   */
  async set(value: VersionValue): Promise<StoreSetResult> {
    try {
      const oldResult = await this.get();
      const oldValue = oldResult.success ? oldResult.value : undefined;
      const fileExists = await pathExists(this.target.file);
      if (!fileExists) {
        if (!this.target.createIfNotExists) {
          return this.createSetError(value, `file is not found: ${this.target.file}`, oldValue, 'set');
        }
        await ensureFile(this.target.file);
      }
      const nextConfig = fileExists ? await this.loadStructuredConfig() : {};
      if (!this.target.path) {
        if (typeof nextConfig === 'object' && nextConfig !== null && !Array.isArray(nextConfig)) {
          return this.createSetError(value, 'path is required for structured target', oldValue, 'set');
        }
        await this.saveStructuredConfig(value as never);
      } else {
        setByPath(nextConfig, this.target.path, value);
        await this.saveStructuredConfig(nextConfig);
      }
      return {
        action: 'set',
        success: true,
        file: this.target.file,
        type: this.target.type,
        oldValue,
        newValue: value,
      };
    } catch (error) {
      return this.createSetError(value, this.getErrorMessage(error), undefined, 'set');
    }
  }

  /**
   * @description 更新结构化文件里的版本值.
   * @param value 版本值.
   */
  async update(value: VersionValue): Promise<StoreSetResult> {
    const result = await this.set(value);
    return {
      ...result,
      action: 'update',
    };
  }

  /**
   * @description 创建读取失败结果.
   * @param message 错误消息.
   */
  protected createGetError(message: string): StoreGetResult {
    return {
      action: 'get',
      success: false,
      file: this.target.file,
      type: this.target.type,
      message,
    };
  }

  /**
   * @description 创建写入失败结果.
   * @param value 目标版本值.
   * @param message 错误消息.
   * @param oldValue 旧版本值.
   * @param action 操作名称.
   */
  protected createSetError(
    value: VersionValue,
    message: string,
    oldValue?: VersionValue,
    action: 'set' | 'update' = 'set',
  ): StoreSetResult {
    return {
      action,
      success: false,
      file: this.target.file,
      type: this.target.type,
      oldValue,
      newValue: value,
      message,
    };
  }

  /**
   * @description 提取异常消息.
   * @param error 异常对象.
   */
  protected getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }

  /**
   * @description 读取结构化配置.
   */
  protected async loadStructuredConfig(): Promise<any> {
    const fileContent = await readFile(this.target.file, this.target.encoding ?? 'utf8');
    switch (this.target.type) {
      case 'json':
        return JSON.parse(fileContent);
      case 'yaml':
        return yaml.load(fileContent);
      case 'toml':
        return parseToml(fileContent);
      case 'xml':
        return new XMLParser({
          ignoreAttributes: true,
        }).parse(fileContent);
      case 'env':
        return this.parseEnvContent(fileContent);
      default:
        throw new Error(`unsupported structured target type: ${this.target.type}`);
    }
  }

  /**
   * @description 保存结构化配置.
   * @param config 配置对象.
   */
  protected async saveStructuredConfig(config: any): Promise<void> {
    const encoding = this.target.encoding ?? 'utf8';
    switch (this.target.type) {
      case 'json':
        await writeFile(this.target.file, JSON.stringify(config, null, 2), encoding);
        return;
      case 'yaml':
        await writeFile(this.target.file, yaml.dump(config), encoding);
        return;
      case 'toml':
        await writeFile(this.target.file, stringifyToml(config), encoding);
        return;
      case 'xml':
        await writeFile(
          this.target.file,
          new XMLBuilder({
            format: true,
            ignoreAttributes: true,
          }).build(config),
          encoding,
        );
        return;
      case 'env':
        await writeFile(this.target.file, this.stringifyEnvContent(config), encoding);
        return;
      default:
        throw new Error(`unsupported structured target type: ${this.target.type}`);
    }
  }

  /**
   * @description 解析 env 文本.
   * @param fileContent 文件内容.
   */
  protected parseEnvContent(fileContent: string): Record<string, unknown> {
    const envConfig: Record<string, unknown> = {};
    const lines = fileContent.split(/\r?\n/);
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) {
        continue;
      }
      const separatorIndex = line.indexOf('=');
      if (separatorIndex < 0) {
        continue;
      }
      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();
      setByPath(envConfig, key.replace(/__/g, '.'), value);
    }
    return envConfig;
  }

  /**
   * @description 序列化 env 对象.
   * @param config 配置对象.
   */
  protected stringifyEnvContent(config: Record<string, unknown>): string {
    const lines: string[] = [];
    const appendLine = (value: unknown, pathSegments: string[]) => {
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        for (const [key, nestedValue] of Object.entries(value)) {
          appendLine(nestedValue, [...pathSegments, key]);
        }
        return;
      }
      const envKey = pathSegments.join('__').toUpperCase();
      lines.push(`${envKey}=${value ?? ''}`);
    };
    for (const [key, value] of Object.entries(config)) {
      appendLine(value, [key]);
    }
    return lines.join('\n');
  }
}
