import { Logger } from '@tikkhun/logger';
import archiver from 'archiver';
import dayjs from 'dayjs';
import fs from 'fs-extra';
import { join } from 'path';
// import ora from 'ora';
// const spinner = ora('Loading...');

export enum ArchiveType {
  zip = 'zip',
  tar = 'tar',
}
// 目前想到的就是用  archive 进行打包。
export interface Options {
  workspace: string;
  include: string[];
  exclude: string[];
  releaseName: string;
  releasePath: string; // 释放的路径
  version: boolean;
  versionPattern: string;
  archiveType: ArchiveType;
  archiveOptions: any;
  clean: boolean;
}
export const DEFAULT_OPTIONS = {
  workspace: process.cwd(),
  include: ['**/*'],
  exclude: ['**/node_modules', '**/release', '**/deploy', '**/.git', '**/.vscode'],
  releaseName: 'project',
  releasePath: 'release',
  version: true,
  versionPattern: 'YYYY_MM_DD_hh_mm_ss',
  archiveType: ArchiveType.zip,
  archiveOptions: {
    zlib: { level: 9 }, // Sets the compression level.
  },
  clean: true,
};
export const ExtensionMap = {
  [ArchiveType.zip]: '.zip',
  [ArchiveType.tar]: '.tar',
};
export class Release {
  options: Options;
  version: string = '';
  get releaseName() {
    return `${this.options.releaseName}_${this.version}`;
  }
  get releaseFile() {
    return this.releaseName + ExtensionMap[this.options.archiveType];
  }
  get releasePath() {
    return join(this.options.workspace, this.options.releasePath);
  }
  get releaseFilePath() {
    return join(this.releasePath, this.releaseFile);
  }
  constructor(options?: Partial<Options>) {
    this.options = Object.assign(DEFAULT_OPTIONS, options);
    if (this.options.version) {
      this.version = dayjs().format(this.options.versionPattern);
    }
    this.watchError();
  }
  watchError() {
    // TODO 当 ctrl+c 删除target文件
    process.on('SIGINT', () => {
      this.clean();
    });
  }
  clean() {
    fs.removeSync(this.releaseFilePath);
  }
  async start() {
    return new Promise(async (resolve, reject) => {
      try {
        this.log.log(`[开始] 压缩文件到路径: ` + this.releaseFilePath);
        await Release.insureDir(this.releasePath);
        if (this.options.clean) {
          // 如果有同名应该先删除
          await fs.remove(this.releaseFilePath);
        }
        const releaseStream = fs.createWriteStream(this.releaseFilePath);
        const archive = archiver(this.options.archiveType, this.options.archiveOptions);
        archive
          .pipe(releaseStream)
          .on('pipe', () => {
            this.log.log('piping');
          })
          .on('close', () => {
            this.log.log('[完毕] 打包完毕');
            resolve(true);
            // spinner.stop();
          });
        // 添加文件
        archive.glob(this.options.include, {
          ignore: this.options.exclude,
          skip: this.options.exclude,
          dot: true,
          cwd: this.options.workspace,
        });
        // 执行
        archive.finalize();
        this.log.log('[开始] 执行打包');
        // spinner.start();
      } catch (error: any) {
        this.log.log('[失败] 执行打包' + error.message);
        reject(error);
      }
    });
  }
  log = new Logger('Release');
  // 确保文件夹
  static async insureDir(dir: string) {
    // 文件夹不存在,就添加文件夹
    if (!fs.existsSync(dir)) {
      await fs.mkdir(dir, { recursive: true });
    }
  }
}
