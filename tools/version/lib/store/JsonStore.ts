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
import { readJson, writeJson } from 'fs-extra';
import { Store } from './Store';

export interface JsonStoreOptions {
  file: string;
  key: string;
}
export const DEFAULT_JSON_STORE_OPTIONS = {
  file: 'package.json',
  key: 'version',
};
export class JsonStore implements Store {
  opts: JsonStoreOptions;
  constructor(options?: Partial<JsonStoreOptions>) {
    this.opts = Object.assign({}, DEFAULT_JSON_STORE_OPTIONS, options);
  }
  async update(value: any) {
    try {
      const originJson = await readJson(this.opts.file);
      await writeJson(
        this.opts.file,
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
