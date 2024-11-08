import { join } from 'path';
import { calculateMD5Sync, getFileSizeSync } from '../file.utils';
import { getLastSegment, getPackageJson } from '../utils';
import { ConfigReader } from './config-reader';
import { getFileNameByPath } from './info-builder.utils';
/**
 * @author
 * @file InfoBuilder.ts
 * @fileBase InfoBuilder
 * @path tools\release-tools\lib\InfoBuilder.ts
 * @from
 * @desc
 * @example
 */
export interface Info {
  name?: string | null;
  title?: string | null;
  version?: string | null;
  description?: string | null;
  tag?: string | null;
  system?: string | null;
  hardware?: string | null;
  releasedAt?: number | null; // Date.now返回的时间戳
  fileSize?: number | null;
  fileMd5?: string | null;
  mainFilePath?: string;
  mainFileName?: string;
  [props: string]: any;
}
export interface InfoBuilderOptions {
  workspace: string;
  configType: 'packageJson'; // 配置类型
  mainFilePath?: string; // 主要文件路径
  input?: Partial<Info>;
}

export class InfoBuilder {
  static defaultOptions: InfoBuilderOptions = {
    workspace: process.cwd(),
    configType: 'packageJson',
    mainFilePath: undefined, // 单文件打包的时候
    input: {
      name: undefined,
      title: undefined,
      version: undefined,
      description: undefined,
      tag: undefined,
      system: undefined,
      hardware: undefined,
    },
  };
  options: InfoBuilderOptions;
  // 项目配置， js项目通常配置在 package.json中
  configReader: ConfigReader;
  constructor(options?: Partial<InfoBuilderOptions>) {
    this.options = Object.assign({}, InfoBuilder.defaultOptions, options);
    const configReaderOptions = this.getConfigReaderOptions();
    this.configReader = new ConfigReader(configReaderOptions);
  }
  private getConfigReaderOptions() {
    if (this.options.configType === 'packageJson') {
      return {
        path: join(this.options.workspace, 'package.json'),
      };
    }
    if (this.options.configType === 'androidXml') {
      return {
        path: join(this.options.workspace, 'android.xml'),
        nameKey: 'application.name',
        // TODO 未完待续
      };
    }
  }

  // 最终目的
  get(): Info {
    return {
      ...this.options.input, // 包括多余的项目参数
      name: this.getName(),
      title: this.getTitle(),
      description: this.getDescription(),
      version: this.getVersion(),
      tag: this.options.input?.tag,
      system: this.options.input?.system,
      hardware: this.options.input?.hardware,
      releasedAt: this.getReleasedAt(),
      fileMd5: this.getFileMd5(),
      fileSize: this.getFileSize(),
      mainFilePath: this.options.mainFilePath,
      mainFileName: this.options.mainFilePath && getFileNameByPath(this.options.mainFilePath),
    };
  }
  private getVersion() {
    return this.options.input?.version || this.getVersionFromProjectConfig();
  }
  private getVersionFromProjectConfig() {
    return this.configReader.getVersion();
  }
  private getFileMd5() {
    if (!this.options.mainFilePath) {
      return null;
    }
    return calculateMD5Sync(this.options.mainFilePath);
  }
  private getFileSize() {
    if (!this.options.mainFilePath) {
      return null;
    }
    return getFileSizeSync(this.options.mainFilePath);
  }
  private getDescription() {
    return this.getDescriptionFromInput() || this.getDescriptionFromProjectConfig();
  }
  private getDescriptionFromInput() {
    return this.options.input?.description;
  }
  private getDescriptionFromProjectConfig() {
    return this.configReader.getDescription();
  }

  private getReleasedAt() {
    return Date.now();
  }
  private getTitle() {
    return this.getTitleFromInput() || this.getTitleFromProjectConfig();
  }
  private getTitleFromInput() {
    return this.options.input?.title;
  }
  private getTitleFromProjectConfig() {
    return this.configReader.getTitle();
  }

  private getName() {
    return this.getNameFromInput() || this.getNameFromProjectConfig() || this.getNameFromWorkspaceFolderName();
  }
  private getNameFromInput() {
    return this.options.input?.name;
  }
  private getNameFromProjectConfig() {
    const configName = this.configReader.getName();
    if (!configName) {
      return configName;
    }
    // 比如 release-tools
    if (!configName.includes?.('/')) {
      return configName;
    }
    // 比如 @tikkhun/release-tools
    return getLastSegment(configName);
  }
  private getNameFromWorkspaceFolderName() {
    // resolve||?
    return getLastSegment(this.options.workspace);
  }
}
