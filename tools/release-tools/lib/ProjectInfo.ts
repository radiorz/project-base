/**
 * # TODO
 * # DONE
 * ## 20240925 星期三
 * - 只干跟信息相关的事情 包括获取版本号 打包时间等，然后转换成 string 或者json 其他就不管了
 * # FUTURE
 */
import { UnderlineDelimiter } from '@tikkhun/utils-core';
import dayjs from 'dayjs';
import _, { isNil } from 'lodash';
const { merge } = _;
import { type ProjectInfo, type ProjectInfoParsed } from './ProjectInfo.interface';
import { getLastSegment, getPackageJson } from './utils';
type stringifyParam = 'projectName' | 'version' | 'versionTag' | 'releasedAt' | 'environment';
export interface ProjectInfoOptions {
  projectName?: string; // 项目名称

  workspace: string; // 工作空间

  versionTag: string; // 比如beta1 这种标签

  timePattern: string; // 时间的具体格式

  environment: string; // 其他环境参数
  // 基本用于打包后的文件名
  // stringify分隔符
  stringifyDelimiter: string;
  // stringify参数
  stringifyParams: stringifyParam[];
}

export class ProjectInfoImpl implements ProjectInfo {
  static options: ProjectInfoOptions = {
    // projectName: undefined,
    workspace: process.cwd(),
    timePattern: 'YYYY_MM_DD_HH_mm_ss',
    versionTag: '',
    environment: '',
    stringifyDelimiter: UnderlineDelimiter,
    stringifyParams: ['projectName', 'version', 'versionTag', 'releasedAt', 'environment'],
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
    return getLastSegment(this.options.workspace) || 'unknown-project';
  }
  getVersion() {
    return this.workspacePackageJson?.version ?? 'unknown';
  }
  getReleasedAt() {
    return dayjs().format(this.options.timePattern);
  }
  // 字符串化有几种方案：
  // - 采用pattern的定义形式 "{app}{yyy}" 但这个有个不好的就是不能parse成原本的配置对象 好处是最灵活
  // - 采用数组排列形式，这个只规定了值的顺序，分隔符，所以可以parse成原本参数， 好处是可以parse， 坏处是不够灵活,但是其实大部分情况我们不需要那么灵活 所以直接这样限制一下吧。
  // 目前采用第二种
  stringify(): string {
    const options = this.toJson();
    return this.options.stringifyParams.map((param) => options[param]).join(this.options.stringifyDelimiter);
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
    return {
      projectName: this.projectName,
      version: this.version,
      versionTag: this.options.versionTag,
      releasedAt: this.releasedAt,
      environment: this.options.environment,
    };
  }
}
