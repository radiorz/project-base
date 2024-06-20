import { Logger } from '@tikkhun/logger';
import archiver from 'archiver';
import dayjs from 'dayjs';
import fs, { readJsonSync } from 'fs-extra';
import { join } from 'path';
// import ora from 'ora';
// const spinner = ora('Loading...');
const logger = new Logger('Release');
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
  withVersion: boolean;
  withTime: boolean;
  timePattern: string;
  archiveType: ArchiveType;
  archiveOptions: any;
  clean: boolean;
}
export const DEFAULT_OPTIONS: Options = {
  workspace: process.cwd(),
  include: ['**/*'],
  exclude: ['**/node_modules', '**/release', '**/deploy', '**/.git', '**/.vscode'],
  releaseName: 'project',
  releasePath: 'release',
  withVersion: true,
  withTime: true,
  timePattern: 'YYYY_MM_DD_hh_mm_ss',
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
  releaseTime: string = '';
  version: string = '';
  get releaseName() {
    return [this.options.releaseName, this.version, this.releaseTime].filter((a) => a).join('_');
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

    this.log.debug!('初始化release tools,配置为: ' + JSON.stringify(this.options, null, 2));
    if (this.options.withVersion) {
      this.version = Release.getVersionFromPackageJson(this.options.workspace);
    }
    if (this.options.withTime) {
      this.releaseTime = dayjs().format(this.options.timePattern);
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
  log = logger;
  // 确保文件夹
  static async insureDir(dir: string) {
    // 文件夹不存在,就添加文件夹
    if (!fs.existsSync(dir)) {
      await fs.mkdir(dir, { recursive: true });
    }
  }
  static getVersionFromPackageJson(workspace = ''): string {
    try {
      const json = readJsonSync(join(workspace, 'package.json'));
      return json.version;
    } catch (error: any) {
      logger.warn('从package.json获取版本错误: ' + error.message);
      return 'unknown';
    }
  }
}
