/**
 * @author
 * @file TextStore.ts
 * @fileBase TextStore
 * @path tools\date-version\lib\store\TextStore.ts
 * @from
 * @desc
 * @todo
 *
 *
 * @done
 * @example
 */

export interface TextStoreOptions {
  file: string;
}
export const DEFAULT_TEXT_STORE_OPTIONS = {};
import fs from 'fs';
import path from 'path';
import { Store } from './Store';

export class TextStore implements Store {
  opts: TextStoreOptions;
  filePath: string;
  constructor(options: TextStoreOptions) {
    this.opts = options;
    this.filePath = path.join(this.opts.file);
  }
  update(text: any): boolean {
    try {
      if (typeof text !== 'string') {
        text = JSON.stringify(text);
      }
      fs.writeFileSync(this.filePath, text, 'utf8');
      return true;
    } catch (error) {
      return false;
    }
  }
}
