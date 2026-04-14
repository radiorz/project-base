import { ensureFile, pathExists, readFile, writeFile } from 'fs-extra';
import { Store, StoreGetResult, StoreSetResult, TextStoreMode, TextVersionTarget, VersionValue } from './Store';

/**
 * @description 文本 store 配置.
 */
export interface TextStoreOptions extends Omit<TextVersionTarget, 'type'> {}

/**
 * @description 文本 store 默认配置.
 */
export const DEFAULT_TEXT_STORE_OPTIONS: TextStoreOptions = {
  file: '',
  mode: 'raw',
  trim: true,
  replacement: '{{version}}',
};

/**
 * @description 文本版本 store.
 */
export class TextStore implements Store {
  /**
   * @description 当前 store 绑定的目标.
   */
  target: TextVersionTarget;

  /**
   * @description 初始化文本 store.
   * @param options store 配置.
   */
  constructor(options: TextStoreOptions) {
    this.target = {
      type: 'text',
      ...DEFAULT_TEXT_STORE_OPTIONS,
      ...options,
    };
  }

  /**
   * @description 读取文本文件中的版本值.
   */
  async get(): Promise<StoreGetResult> {
    try {
      if (!(await pathExists(this.target.file))) {
        return this.createGetError(`file is not found: ${this.target.file}`);
      }
      const text = await readFile(this.target.file, this.target.encoding ?? 'utf8');
      const value = this.resolveValueFromText(text);
      if (value === undefined) {
        return this.createGetError('version is not found in text content');
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
   * @description 写入文本文件中的版本值.
   * @param value 版本值.
   */
  async set(value: VersionValue): Promise<StoreSetResult> {
    try {
      const oldResult = await this.get();
      const oldValue = oldResult.success ? oldResult.value : undefined;
      const nextText = await this.createNextText(value);
      await this.writeText(nextText);
      return {
        action: 'set',
        success: true,
        file: this.target.file,
        type: this.target.type,
        oldValue,
        newValue: value,
      };
    } catch (error) {
      return {
        action: 'set',
        success: false,
        file: this.target.file,
        type: this.target.type,
        newValue: value,
        message: this.getErrorMessage(error),
      };
    }
  }

  /**
   * @description 更新文本文件中的版本值.
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
   * @description 从文本内容中提取版本值.
   * @param text 文件内容.
   */
  protected resolveValueFromText(text: string): VersionValue | undefined {
    if (this.target.mode === 'replace') {
      const regexp = this.createPattern();
      const match = regexp.exec(text);
      if (!match) {
        return undefined;
      }
      const namedVersion = match.groups?.version;
      if (namedVersion !== undefined) {
        return namedVersion;
      }
      if (match[1] !== undefined) {
        return match[1];
      }
      return match[0];
    }
    if (this.target.trim) {
      return text.trim();
    }
    return text;
  }

  /**
   * @description 生成下一份文本内容.
   * @param value 版本值.
   */
  protected async createNextText(value: VersionValue): Promise<string> {
    if (this.target.mode === 'replace') {
      if (!(await pathExists(this.target.file))) {
        throw new Error(`file is not found: ${this.target.file}`);
      }
      const oldText = await readFile(this.target.file, this.target.encoding ?? 'utf8');
      const regexp = this.createPattern();
      if (!regexp.test(oldText)) {
        throw new Error('pattern is not matched');
      }
      const replacement = (this.target.replacement ?? '{{version}}').replaceAll('{{version}}', String(value));
      return oldText.replace(this.createPattern(), replacement);
    }
    return String(value);
  }

  /**
   * @description 写入文本内容.
   * @param text 文件内容.
   */
  protected async writeText(text: string): Promise<void> {
    if (!(await pathExists(this.target.file))) {
      if (!this.target.createIfNotExists) {
        throw new Error(`file is not found: ${this.target.file}`);
      }
      await ensureFile(this.target.file);
    }
    await writeFile(this.target.file, text, this.target.encoding ?? 'utf8');
  }

  /**
   * @description 构建替换正则.
   */
  protected createPattern(): RegExp {
    if (!this.target.pattern) {
      throw new Error('pattern is required when text mode is replace');
    }
    return new RegExp(this.target.pattern, this.target.flags);
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
   * @description 提取异常消息.
   * @param error 异常对象.
   */
  protected getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }
}
