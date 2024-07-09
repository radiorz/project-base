// 有一种情况就是Semantic版本 都是数字
// 然后 分为 major minor patch 去更新版本
// 这个package.json中可以使用npm的cli进行 管理

import { readJson } from 'fs-extra';
import { workspace } from '../utils';
import path from 'path';
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
}
export const DEFAULT_SEMANTIC_VERSION_GETTER_OPTIONS: SemanticVersionGetterOptions = {
  file: 'package.json',
  position: Positions.patch,
};
export class SemanticVersionGetter implements Getter {
  opts: SemanticVersionGetterOptions;
  filePath: string;
  constructor(options?: Partial<SemanticVersionGetterOptions>) {
    this.opts = Object.assign(DEFAULT_SEMANTIC_VERSION_GETTER_OPTIONS, options);
    this.filePath = path.join(workspace, this.opts.file);
  }
  async get() {
    const { version: oldVersion } = await readJson(this.filePath);
    const [major, minor, patch] = oldVersion.split('.');
    if (this.opts.position === Positions.major) {
      return [Number(major) + 1, minor, patch].join('.');
    } else if (this.opts.position === Positions.minor) {
      return [major, Number(minor) + 1, patch].join('.');
    }
    return [major, minor, Number(patch) + 1].join('.');
  }
}
