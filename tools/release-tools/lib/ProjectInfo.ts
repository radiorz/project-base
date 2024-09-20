import { merge } from 'lodash';
import { UnderlineDelimiter } from '@tikkhun/utils-core';
import dayjs from 'dayjs';
import { ProjectInfoParsed, type ProjectInfo } from './ProjectInfo.interface';
import { getVersionFromPackageJson } from './utils';

export interface ProjectInfoOptions {
  projectName: string; // 项目名称

  withVersion: boolean; // 带版本号
  workspace: string; // 工作空间

  versionTag: string; // 比如beta1 这种标签

  withReleasedAt: boolean; // 带打包时间
  timePattern: string; // 时间的具体格式

  environment: string; // 其他环境参数
}

export class ProjectInfoImpl implements ProjectInfo {
  static options: ProjectInfoOptions = {
    projectName: 'project',
    withVersion: true,
    workspace: process.cwd(),
    withReleasedAt: true,
    timePattern: 'YYYY_MM_DD_HH_mm_ss',
    versionTag: '',
    environment: '',
  };

  releasedAt?: string;
  version?: string;
  options: ProjectInfoOptions;
  constructor(options: Partial<ProjectInfoOptions>) {
    this.options = merge({}, ProjectInfoImpl.options, options);
    this.version = this.getVersion?.();
    this.releasedAt = this.getReleasedAt?.();
  }
  getVersion() {
    return getVersionFromPackageJson(this.options.workspace);
  }
  getReleasedAt() {
    return dayjs().format(this.options.timePattern);
  }
  stringify(): string {
    return [
      this.options.projectName,
      this.options.withVersion && this.version,
      this.options.versionTag,
      this.options.withReleasedAt && this.releasedAt,
      this.options.environment,
    ]
      .filter((a) => a)
      .join(UnderlineDelimiter);
  }
  // 如果想要保存一份说明到json文件中
  toJson() {
    return {
      projectName: this.options.projectName,
      version: this.version,
      versionTag: this.options.versionTag,
      releasedAt: this.releasedAt,
      environment: this.options.environment,
    };
  }
  parse(string: string): ProjectInfoParsed {
    const infos = string.split(UnderlineDelimiter);
    if (this.options.withVersion && this.options.withReleasedAt) {
      return {
        projectName: infos[0],
        version: infos[1],
        versionTag: infos[2],
        releasedAt: infos[3],
        environment: infos[4],
      };
    }
    if (this.options.withVersion && !this.options.withReleasedAt) {
      return {
        projectName: infos[0],
        version: infos[1],
        versionTag: infos[2],
        environment: infos[3],
      };
    }
    return {
      projectName: infos[0],
      versionTag: infos[1],
      environment: infos[2],
    };
  }
}
