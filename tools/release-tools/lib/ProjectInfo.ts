/**
 * # TODO
 * # DONE
 * ## 20240925 星期三
 * - 只干跟信息相关的事情 包括获取版本号 打包时间等，然后转换成 string 或者json 其他就不管了
 * # FUTURE
 */
import { optionsMerge, UnderlineDelimiter } from '@tikkhun/utils-core';
import dayjs from 'dayjs';
import { calculateMD5Sync, getFileSizeSync } from './file.utils';
import { transformObjectByOptionsMap } from './object.utils';
import type { ProjectInfo, ProjectInfoOptions } from './ProjectInfo.interface';
import { getLastSegment, getPackageJson } from './utils';

export class ProjectInfoImpl implements ProjectInfo {
  static defaultOptions: ProjectInfoOptions = {
    projectName: undefined,
    workspace: process.cwd(),
    // 有的时候只需打包一个文件就用以下情况
    filePath: undefined,
    // released at pattern
    timePattern: 'YYYY_MM_DD_HH_mm_ss',
    versionTag: '',
    system: '',
    hardware: '',
    stringifyDelimiter: UnderlineDelimiter,
    stringifyParams: ['projectName', 'version', 'versionTag', 'releasedAt', 'system', 'hardware'],
    jsonMap: undefined,
  };
  options: ProjectInfoOptions;
  workspacePackageJson: Record<string, any> | null;
  constructor(options: Partial<ProjectInfoOptions>) {
    this.options = optionsMerge(ProjectInfoImpl.defaultOptions, options);
    this.workspacePackageJson = getPackageJson(this.options.workspace);
    this.projectName = this.getProjectName();
    this.version = this.getVersion();
    this.releasedAt = this.getReleasedAt();
  }
  projectName?: string;
  version?: string;
  releasedAt?: string;
  fileMd5?: string;
  fileSize?: string;
  getProjectName() {
    if (this.options.projectName) return this.options.projectName;
    // 如果有输入就是用输入的值
    // 一个是从package.json中读取
    const name = this.workspacePackageJson?.name?.includes('/')
      ? getLastSegment(this.workspacePackageJson?.name)
      : this.workspacePackageJson?.name;
    if (name) return name;
    // 一个是从文件夹命名
    return getLastSegment(this.options.workspace) || 'unknown-project';
  }
  getVersion() {
    return this.workspacePackageJson?.version ?? 'unknown';
  }
  getReleasedAt() {
    return dayjs().format(this.options.timePattern);
  }
  getFileSize() {
    if (!this.options.filePath) {
      return null;
    }
    return getFileSizeSync(this.options.filePath);
  }
  getFileMD5() {
    if (!this.options.filePath) {
      return null;
    }
    return calculateMD5Sync(this.options.filePath);
  }
  // 字符串化有几种方案：
  // - 采用pattern的定义形式 "{app}{yyy}" 但这个有个不好的就是不能parse成原本的配置对象 好处是最灵活
  // - 采用数组排列形式，这个只规定了值的顺序，分隔符，所以可以parse成原本参数， 好处是可以parse， 坏处是不够灵活,但是其实大部分情况我们不需要那么灵活 所以直接这样限制一下吧。
  // 目前采用第二种
  stringify(): string {
    const options = this.toJson();
    return this.options.stringifyParams.map((param) => options?.[param]).join(this.options.stringifyDelimiter);
  }
  parse(str: string): Record<string, any> {
    const paramObj: Record<string, string> = {};
    const values = str.split(this.options.stringifyDelimiter);
    this.options.stringifyParams.forEach((param, index) => {
      // 根据params规定的位置取出字符串中的值,赋值给变量对象
      paramObj[param] = values[index];
    });
    return paramObj;
  }
  // 如果想要保存一份说明到json文件中
  toJson() {
    const obj: Record<string, any> = {
      projectName: this.projectName,
      version: this.version,
      versionTag: this.options.versionTag,
      releasedAt: this.releasedAt,
      hardware: this.options.hardware,
      system: this.options.system,
      filePath: this.options.filePath,
    };
    if (this.options.filePath) {
      const fileMd5 = this.getFileMD5();
      const fileSize = this.getFileSize();
      obj['fileMd5'] = fileMd5;
      obj['fileSize'] = fileSize;
    }
    if (this.options?.jsonMap) {
      return transformObjectByOptionsMap(obj, this.options?.jsonMap);
    }
    return obj;
  }
}
