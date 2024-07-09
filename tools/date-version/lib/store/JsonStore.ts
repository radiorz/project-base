import fs from 'fs';
import path from 'path';
import { workspace } from '../utils';
import { readJson, writeJson } from 'fs-extra';
import { Store } from './Store';
/**
 * @author
 * @file JsonStore.ts
 * @fileBase JsonStore
 * @path tools\date-version\lib\store\JsonStore.ts
 * @from
 * @desc
 * @todo
 *
 *
 * @done
 * @example
 */

export interface JsonStoreOptions {
  file: string;
  key: string;
}
export const DEFAULT_OPTIONS = {
  file: 'package.json',
  key: 'version',
};
export class JsonStore implements Store {
  opts: JsonStoreOptions;
  filePath: string;
  constructor(options?: Partial<JsonStoreOptions>) {
    this.opts = Object.assign(DEFAULT_OPTIONS, options);
    this.filePath = path.join(workspace, this.opts.file);
  }
  async update(value: any) {
    try {
      const originJson = await readJson(this.filePath);
      await writeJson(
        this.filePath,
        {
          ...originJson,
          [this.opts.key]: value,
        },
        {
          spaces: 2,
        },
      );
      return true;
    } catch (error) {
      return false;
    }
  }
}
