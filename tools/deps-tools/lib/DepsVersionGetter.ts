import { join } from 'path';
import { workspace } from '../../version/lib/utils';
import { readJSON, writeJSON } from 'fs-extra';
import { ChildProcess, execSync } from 'child_process';
import { optionsMerge } from '@tikkhun/utils-core';
// 经常一个版本是需要更新到指定版本的，但monorepo 需要改相当多包，写个脚本搞定
/**
 * @author
 * @file DepsVersionGetter.ts
 * @fileBase DepsVersionGetter
 * @path tools\deps-tools\lib\DepsVersionGetter.ts
 * @from
 * @desc
 * @example
 */

export interface DepsVersionGetterOptions {
  include?: string[];
  exclude: string[];
  workspace: string[];
  showNotNeedChanged: boolean;
}
export interface VersionInfo {
  name: string;
  oldVersion: string;
  newVersion: string;
}
export class DepsVersionGetter {
  static defaultOptions: DepsVersionGetterOptions = Object.freeze({
    workspace: [process.cwd()], // 项目
    include: undefined,
    exclude: [],
    showNotNeedChanged: false,
  });
  options: DepsVersionGetterOptions;
  constructor(options?: Partial<DepsVersionGetterOptions>) {
    this.options = optionsMerge(DepsVersionGetter.defaultOptions, options);
  }
  async get() {
    if (!this.options.workspace.length) {
      this.options.workspace = [process.cwd()];
    }
    return Promise.all(
      this.options.workspace.map(async (workspace) => {
        // console.log(`workspace`, workspace);
        const { devDependencies, dependencies } = await DepsVersionGetter.loadPackageJSON(workspace);
        const allDependencies = { ...devDependencies, ...dependencies };
        const versionInfos = Object.entries(allDependencies).map(
          ([name, oldVersion]): VersionInfo => DepsVersionGetter.getVersionInfo(name, oldVersion as string),
        );
        if (this.options.showNotNeedChanged) {
          return {
            workspace,
            versionInfos: versionInfos,
          };
        }
        const needUpdateVersions = versionInfos.filter(DepsVersionGetter.checkUpdateNeeded);
        return {
          workspace,
          versionInfos: needUpdateVersions,
        };
      }),
    );
  }
  static getVersionInfo(name: string, oldVersion: string): VersionInfo {
    let newVersion = DepsVersionGetter.getDepLatestVersion(name);
    if (oldVersion.startsWith('^')) {
      newVersion = `^${newVersion}`;
    } else if (oldVersion.startsWith('~')) {
      newVersion = `~${newVersion}`;
    } else if (oldVersion.startsWith('~')) {
      newVersion = `~${newVersion}`;
    }
    if (typeof oldVersion === 'string') {
      return {
        name,
        oldVersion,
        newVersion,
      };
    } else {
      return {
        name,
        oldVersion: '',
        newVersion,
      };
    }
  }
  static checkUpdateNeeded(data: VersionInfo) {
    return !data.oldVersion.endsWith(data.newVersion);
  }
  static getPackageJsonPath(workspace: string) {
    return join(workspace, 'package.json');
  }
  static loadPackageJSON(workspace: string) {
    const packageJsonDir = this.getPackageJsonPath(workspace);
    return readJSON(packageJsonDir);
  }

  static getDepLatestVersion(packageName: string): string {
    const version = execSync(`npm view ${packageName} version`).toString().trim();
    return version;
  }
}
