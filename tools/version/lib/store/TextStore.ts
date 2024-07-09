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
import { workspace } from '../utils';

export class TextStore implements Store {
  opts: TextStoreOptions;
  filePath: string;
  constructor(options: TextStoreOptions) {
    this.opts = options;
    this.filePath = path.join(workspace, this.opts.file);
    console.log(`this.filePath`, this.filePath);
  }
  update(text: any): boolean {
    try {
      if (typeof text !== 'string') {
        text = JSON.stringify(text);
      }
      console.log(`this.filePath,text`, this.filePath, text);
      fs.writeFileSync(this.filePath, text, 'utf8');
      return true;
    } catch (error) {
      return false;
    }
  }
}
