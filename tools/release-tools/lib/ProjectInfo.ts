import { UnderlineDelimiter } from '@tikkhun/utils-core';
import dayjs from 'dayjs';
import { merge } from 'lodash';
import { type ProjectInfoParsed, type ProjectInfo } from './ProjectInfo.interface';
import { getLastSegment, getPackageJson } from './utils';

export interface ProjectInfoOptions {
  projectName?: string; // 项目名称

  withVersion: boolean; // 带版本号
  workspace: string; // 工作空间

  versionTag: string; // 比如beta1 这种标签

  withReleasedAt: boolean; // 带打包时间
  timePattern: string; // 时间的具体格式

  environment: string; // 其他环境参数
}

export class ProjectInfoImpl implements ProjectInfo {
  static options: ProjectInfoOptions = {
    // projectName: undefined,
    withVersion: true,
    workspace: process.cwd(),
    withReleasedAt: true,
    timePattern: 'YYYY_MM_DD_HH_mm_ss',
    versionTag: '',
    environment: '',
  };

  releasedAt?: string;
  version?: string;
  projectName?: string;
  options: ProjectInfoOptions;
  workspacePackageJson: Record<string, any> | null;
  constructor(options: Partial<ProjectInfoOptions>) {
    this.options = merge({}, ProjectInfoImpl.options, options);
    this.workspacePackageJson = getPackageJson(this.options.workspace);
    // console.log(`this.workspacePackageJson`, this.workspacePackageJson);
    this.version = this.getVersion();
    this.releasedAt = this.getReleasedAt();
    this.projectName = this.getProjectName();
  }
  getProjectName() {
    if (this.options.projectName) return this.options.projectName;
    // 如果有输入就是用输入的值
    // 一个是从package.json中读取
    const name = this.workspacePackageJson?.name?.includes('/')
      ? getLastSegment(this.workspacePackageJson?.name)
      : this.workspacePackageJson?.name;
    if (name) return name;
    // 一个是从文件夹命名
    return getLastSegment(this.options.workspace) || 'projectUnknown';
  }
  getVersion() {
    return this.workspacePackageJson?.version ?? 'unknown';
  }
  getReleasedAt() {
    return dayjs().format(this.options.timePattern);
  }
  stringify(): string {
    return [
      this.projectName,
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
      projectName: this.projectName,
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
