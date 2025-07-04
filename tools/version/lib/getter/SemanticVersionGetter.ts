// 有一种情况就是Semantic版本 都是数字
// 然后 分为 major minor patch 去更新版本
// 这个package.json中可以使用npm的cli进行 管理

import { pathExists, readJson } from 'fs-extra';
import { Getter } from './Getter';
/**
 * @author
 * @file SimpleVersionGetter.ts
 * @fileBase SimpleVersionGetter
 * @path tools\version\lib\getter\SimpleVersionGetter.ts
 * @from
 * @desc
 * @todo
 *
 *
 * @done
 * @example
 */

export enum Positions {
  major = 0,
  minor,
  patch,
}
export interface SemanticVersionGetterOptions {
  file: string;
  position: Positions;
  key: string;
}
export const DEFAULT_SEMANTIC_VERSION_GETTER_OPTIONS: SemanticVersionGetterOptions = {
  file: 'package.json',
  position: Positions.patch,
  key: 'version',
};
export class SemanticVersionGetter implements Getter {
  opts: SemanticVersionGetterOptions;
  constructor(options?: Partial<SemanticVersionGetterOptions>) {
    this.opts = Object.assign({}, DEFAULT_SEMANTIC_VERSION_GETTER_OPTIONS, options);
  }
  async get() {
    // TODO 这里只能在当前层级上读，其实可以一级一级网上找
    if (!(await pathExists(this.opts.file))) {
      throw new Error('get new version,but error: the file is not found');
    }
    const { [this.opts.key]: oldVersion } = await readJson(this.opts.file);
    if (!oldVersion) {
      throw new Error('get new version, but error: the old version is not found');
    }
    if (typeof oldVersion !== 'string') {
      throw new Error(
        `get new version, but error: the old version is not string,old version: ${JSON.stringify(oldVersion)}`,
      );
    }
    const [major, minor, patch] = oldVersion.split('.');
    if (this.opts.position === Positions.major) {
      return [Number(major) + 1, minor, patch].join('.');
    } else if (this.opts.position === Positions.minor) {
      return [major, Number(minor) + 1, patch].join('.');
    }
    return [major, minor, Number(patch) + 1].join('.');
  }
}
