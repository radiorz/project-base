import dayjs from 'dayjs';
import { readJson, writeJson } from 'fs-extra';
import { Logger } from '@tikkhun/logger';
import path from 'path';
const rootDir = process.cwd();
export interface Options {
  filePath: string;
  pattern: string;
}
export const DEFAULT_OPTIONS = {
  pattern: 'YYYY.MM.DD',
  filePath: path.join(rootDir, 'package.json'),
};
export class DateVersion {
  log = new Logger(this.constructor.name);

  static get(pattern: string) {
    return dayjs().format(pattern);
  }
  static async updateJson(options?: Partial<Options>) {
    const opts: Options = Object.assign(DEFAULT_OPTIONS, options);
    const version = this.get(opts.pattern);
    const originJson = await readJson(opts.filePath);
    await writeJson(
      opts.filePath,
      {
        ...originJson,
        version,
      },
      {
        spaces: 2,
      },
    );
    return { version };
  }
  options: Options;
  constructor(options?: Partial<Options>) {
    this.options = Object.assign(DEFAULT_OPTIONS, options);
  }
  get() {
    return DateVersion.get(this.options.pattern);
  }
  async update() {
    const { version } = await DateVersion.updateJson(this.options);
    this.log.log('[成功] 更新JSON版本号: ' + version);
  }
}
