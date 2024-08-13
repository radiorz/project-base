import { Logger } from '@tikkhun/logger';
import archiver from 'archiver';
import dayjs from 'dayjs';
import fs, { readJsonSync } from 'fs-extra';
import { join } from 'path';
// import ora from 'ora';
// const spinner = ora('Loading...');
const logger = new Logger('Release');
import { merge } from 'lodash';
import { UnderlineDelimiter } from '@tikkhun/utils-core';
export interface ReleaseFileNameOptions {
  workspace: string; // 项目根目录
  projectName: string; // 项目名称
  withVersion: boolean; // 带版本号
  withTime: boolean; // 带打包时间
  timePattern: string; // 时间的具体格式
  versionTag: string; // 比如beta1 这种标签
  environment: string; // 其他环境参数
  releaseFileNameBuilder: (options: Partial<ReleaseFileNameBuilderOptions>) => string;
}
export interface ReleaseFileNameBuilderOptions {
  projectName: string;
  version: string;
  releaseTime: string;
  versionTag: string; // 版本标志
  environment: string; // 环境参数
}
export class ReleaseFileName {
  static options: ReleaseFileNameOptions = {
    workspace: process.cwd(),
    projectName: 'project',
    withVersion: true,
    withTime: true,
    timePattern: 'YYYY_MM_DD_hh_mm_ss',
    versionTag: '',
    environment: '',
    releaseFileNameBuilder: function (options: Partial<ReleaseFileNameBuilderOptions>): string {
      return [options.projectName, options.version, options.versionTag, options.releaseTime, options.environment]
        .filter((a) => a)
        .join(UnderlineDelimiter);
    },
  };
  static getVersionFromPackageJson(workspace = ''): string {
    try {
      const json = readJsonSync(join(workspace, 'package.json'));
      return json.version;
    } catch (error: any) {
      logger.warn('从package.json获取版本错误: ' + error.message);
      return 'unknown';
    }
  }
  static getTimeByPattern(pattern: string) {
    return dayjs().format(pattern);
  }
  static get(options: Partial<ReleaseFileNameOptions>) {
    const { releaseFileNameBuilder, withVersion, withTime, ...opts } = Object.assign(ReleaseFileName.options, options);
    let version = withVersion ? ReleaseFileName.getVersionFromPackageJson() : '';
    let releaseTime = withTime ? ReleaseFileName.getTimeByPattern(opts.timePattern) : '';
    return releaseFileNameBuilder({
      ...opts,
      version,
      releaseTime,
    });
  }

  releaseTime: string = '';
  version: string;
  options: ReleaseFileNameOptions;
  constructor(options: Partial<ReleaseFileNameOptions>) {
    this.options = merge(ReleaseFileName.options, options);
    this.version = this.options.withVersion ? ReleaseFileName.getVersionFromPackageJson() : '';
    this.releaseTime = this.options.withTime ? ReleaseFileName.getTimeByPattern(this.options.timePattern) : '';
  }
  get() {
    return this.options.releaseFileNameBuilder({
      ...this.options,
      releaseTime: this.releaseTime,
      version: this.version,
    });
  }
}
export enum ArchiveType {
  zip = 'zip',
  tar = 'tar',
}
// 目前想到的就是用  archive 进行打包。
export interface ReleaseOptions {
  /* # 打包源头 */
  workspace: string;
  include: string[];
  exclude: string[];
  /* ## 打包的压缩类型 */
  archiveType: ArchiveType;
  archiveOptions: Record<string, any>;
  /* # 存放相关 */
  /* ## 文件名称 */
  releasePath: string; // 释放的路径
  releaseFileNameOptions: Partial<ReleaseFileNameOptions>;
  /* ## 是否清空 */
  clean: boolean;
}
export const ExtensionMap = {
  [ArchiveType.zip]: '.zip',
  [ArchiveType.tar]: '.tar',
  // [ArchiveType.tar]: '.tar.gz',
};

export const DEFAULT_RELEASE_OPTIONS: ReleaseOptions = {
  workspace: process.cwd(),
  include: ['**/*'],
  exclude: ['**/node_modules', '**/release', '**/deploy', '**/.git', '**/.vscode'],
  archiveType: ArchiveType.zip,
  archiveOptions: {
    zlib: { level: 9 }, // Sets the compression level.
  },
  clean: true,
  releasePath: 'release',
  releaseFileNameOptions: ReleaseFileName.options,
};

export class Release {
  options: ReleaseOptions;
  releaseFileName: ReleaseFileName;
  log = logger;
  get releaseFile() {
    return this.releaseFileName.get() + ExtensionMap[this.options.archiveType];
  }
  get releasePath() {
    return join(this.options.workspace, this.options.releasePath);
  }
  get releaseFilePath() {
    return join(this.releasePath, this.releaseFile);
  }
  constructor(options?: Partial<ReleaseOptions>) {
    this.options = merge(DEFAULT_RELEASE_OPTIONS, options);
    this.log.debug!('初始化release tools,配置为: ' + JSON.stringify(this.options, null, 2));
    // 名称
    this.releaseFileName = new ReleaseFileName({
      ...this.options.releaseFileNameOptions,
      workspace: this.options.workspace,
    });
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
        this.log.log(`[开始] 释放文件确认: ` + this.releasePath);
        await Release.insureDir(this.releasePath);
        if (this.options.clean) {
          this.log.log(`[开始] 重名文件删除 ` + this.releaseFilePath);
          // 如果有同名应该先删除
          await fs.remove(this.releaseFilePath);
        }
        this.log.log(`[开始] 打包，文件为: ` + this.releaseFilePath);
        // 打包
        const releaseStream = fs.createWriteStream(this.releaseFilePath);
        const archive = archiver(this.options.archiveType, this.options.archiveOptions);
        archive
          .pipe(releaseStream)
          .on('pipe', () => {
            this.log.log('piping');
          })
          .on('error', (err) => {
            this.log.error('[失败] 打包,但失败，原因为：' + err.message);
            reject(err);
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
        this.log.log('[开始] 执行打包');
        // spinner.start();
        await archive.finalize();
        this.log.log('[结束] 执行打包');
      } catch (error: any) {
        this.log.error('[失败] 执行打包' + error.message);
        reject(error);
      }
    });
  }

  // 确保文件夹
  static async insureDir(dir: string) {
    // 文件夹不存在,就添加文件夹
    if (!fs.existsSync(dir)) {
      await fs.mkdir(dir, { recursive: true });
    }
  }
}
