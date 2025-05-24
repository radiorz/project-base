/**
 * @author
 * @file DepsVersionUpdater.ts
 * @fileBase DepsVersionUpdater
 * @path tools\deps-tools\lib\DepsVersionUpdater.ts
 * @from
 * @desc
 * @example
 */

import { writeJSON } from 'fs-extra';
import { mergeOptions } from '@tikkhun/utils-core';
import { DepsVersionGetter, VersionInfo } from './DepsVersionGetter';
import { workspace } from '../../version/lib/utils';
import { packageJsonPath } from '../../../packages/node-utils/lib/path';

export interface DepsVersionUpdaterOptions {
  workspace: string[];
  include?: string[];
  exclude: string[];
}

export class DepsVersionUpdater {
  static defaultOptions: DepsVersionUpdaterOptions = Object.freeze({
    workspace: [process.cwd()], // 项目
    include: undefined,
    exclude: [],
  });
  options: DepsVersionUpdaterOptions;
  depsVersionGetter: DepsVersionGetter;
  constructor(options?: Partial<DepsVersionUpdaterOptions>) {
    this.options = mergeOptions(DepsVersionUpdater.defaultOptions, options);
    this.depsVersionGetter = new DepsVersionGetter({
      ...options,
    });
  }
  static savePackageJSON(workspace: string, data: JSON) {
    const packageJsonPath = DepsVersionGetter.getPackageJsonPath(workspace);
    return writeJSON(packageJsonPath, data);
  }
  async update() {
    for (const workspace of this.options.workspace) {
      try {
        const packageJson = await DepsVersionGetter.loadPackageJSON(workspace);

        const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };

        const needUpdateDepsVersionInfos = Object.entries(allDeps)
          .map(([name, oldVersion]) => DepsVersionGetter.getVersionInfo(name, oldVersion as string))
          .filter(DepsVersionGetter.checkUpdateNeeded);
        needUpdateDepsVersionInfos.forEach((info) => {
          if (packageJson.dependencies?.[info.name]) {
            packageJson.dependencies[info.name] = info.newVersion;
          } else if (packageJson.devDependencies?.[info.name]) {
            packageJson.devDependencies[info.name] = info.newVersion;
          }
        });

        return await DepsVersionUpdater.savePackageJSON(workspace, packageJson);
      } catch (error) {
        console.log(`${workspace}更新失败`);
      }
    }
  }
}
