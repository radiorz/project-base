import { calculateMD5Sync, getFileSizeSync } from './file.utils';
import { getLastSegment } from './utils';

/**
 * @author
 * @file InfoManager.ts
 * @fileBase InfoManager
 * @path tools\release-tools\lib\InfoManager.ts
 * @from
 * @desc
 * @example
 */
// export type From = 'input' | 'packageJson' | 'workspaceFolderName';
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
}
export interface InfoManagerOptions {
  workspace: string;
  packageJsonPath: string;
  filePath?: string;
  input?: Partial<Info>;
}

export class InfoManager {
  static defaultOptions: InfoManagerOptions = {
    workspace: process.cwd(),
    packageJsonPath: 'package.json',
    filePath: undefined,
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
  options: InfoManagerOptions;
  packageJson: Record<string, any>;
  constructor(options?: Partial<InfoManagerOptions>) {
    this.options = Object.assign({}, InfoManager.defaultOptions, options);
    this.packageJson = this.options;
  }
  // 最终目的
  getInfo(): Info {
    return {
      name: this.getName(),
      title: this.getTitle(),
      description: this.getDescription(),
      tag: this.options.input?.tag,
      system: this.options.input?.system,
      hardware: this.options.input?.hardware,
      releasedAt: this.getReleasedAt(),
      fileMd5: this.getFileMd5(),
      fileSize: this.getFileSize(),
    };
  }
  private getFileMd5() {
    if (!this.options.filePath) {
      return null;
    }
    return calculateMD5Sync(this.options.filePath);
  }
  private getFileSize() {
    if (!this.options.filePath) {
      return null;
    }
    return getFileSizeSync(this.options.filePath);
  }
  private getDescription() {
    return this.getDescriptionFromInput() ?? this.getDescriptionFromPackageJson();
  }
  private getDescriptionFromInput() {
    return this.options.input?.description;
  }
  private getDescriptionFromPackageJson() {
    return this.packageJson?.description;
  }

  private getReleasedAt() {
    return Date.now();
  }
  private getTitle() {
    return this.getTitleFromInput() ?? this.getTitleFromPackageJson();
  }
  private getTitleFromInput() {
    return this.options.input?.title;
  }
  private getTitleFromPackageJson() {
    return this.packageJson?.title;
  }

  private getName() {
    return this.getNameFromInput() ?? this.getNameFromPackageJson() ?? this.getNameFromWorkspaceFolderName();
  }
  private getNameFromInput() {
    return this.options.input?.name;
  }
  private getNameFromPackageJson() {
    if (!this.packageJson?.name) {
      return this.packageJson?.name;
    }
    // 比如 release-tools
    if (!this.packageJson.name.includes?.('/')) {
      return this.packageJson?.name;
    }
    // 比如 @tikkhun/release-tools
    return getLastSegment(this.packageJson.name);
  }
  private getNameFromWorkspaceFolderName() {
    // resolve???
    return getLastSegment(this.options.workspace);
  }
}
