/**
 * 实际上就是实现核心的打包功能
 */
import { Logger } from '@tikkhun/logger';
import { optionsMerge } from '@tikkhun/utils-core';
import archiver from 'archiver';
import fsExtra from 'fs-extra';
import { join } from 'path';
import { Info } from './InfoBuilder/InfoBuilder';
import { ProgressPrinter } from './ProgressPrinter';
import { ReleaseInfoStore } from './ReleaseInfo';
import { ensureDir } from './utils';
const { removeSync, remove, createWriteStream } = fsExtra;
const logger = new Logger('Release');
export enum ArchiveType {
  zip = 'zip',
  tar = 'tar',
}

export interface ReleaseOptions {
  /* # 打包源头 */
  workspace: string;
  include: string[];
  exclude: string[];
  /* ## 打包的压缩类型 */
  archiveType: ArchiveType;
  // archiveOptions: Record<string, any>;
  /* ## 是否清空 */
  clean: boolean;
  /* # 存放相关 */
  releasePathRelative: 'cwd' | 'workspace';
  /* ## 释放文件夹名称 */
  releasePath: string; // 释放的文件夹路径
  releaseName: string; // 文件夹名称
  info: Info;
  infoStore?: ReleaseInfoStore | null;
}
export const ExtensionMap = {
  [ArchiveType.zip]: '.zip',
  [ArchiveType.tar]: '.tar.gz', // 直接压缩
  // [ArchiveType.tar]: '.tar.gz',
};

export class Release {
  static defaultOptions: ReleaseOptions = {
    workspace: process.cwd(),
    include: ['**/*'],
    exclude: ['**/node_modules', '**/release', '**/deploy', '**/.git', '**/.vscode'],
    archiveType: ArchiveType.zip,
    clean: true,
    releasePathRelative: 'cwd', // 默认直接保存到当前执行的文件夹比较可能
    releasePath: 'release',
    releaseName: 'release' + Date.now(),
    info: {},
    infoStore: undefined,
  };
  options: ReleaseOptions;
  log = logger;
  get releaseFile() {
    return this.options.releaseName + ExtensionMap[this.options.archiveType];
  }
  get releasePath() {
    return join(
      this.options.releasePathRelative === 'cwd' ? process.cwd() : this.options.workspace,
      this.options.releasePath,
    );
  }
  get releaseFilePath() {
    return join(this.releasePath, this.releaseFile);
  }
  progressPrinter: ProgressPrinter | null = null;
  constructor(options?: Partial<ReleaseOptions>) {
    this.options = optionsMerge(Release.defaultOptions, options);
    this.log.debug!('初始化release tools,配置为: ' + JSON.stringify(this.options, null, 2));
    // 项目信息
    this.watchError();
  }

  watchError() {
    // TODO 当 ctrl+c 删除target文件
    process.on('SIGINT', () => {
      this.clean();
    });
  }
  clean() {
    this.progressPrinter?.end?.();
    removeSync(this.releaseFilePath);
  }
  private async ensureReleasePath() {
    this.log.log(`[开始] 确认释放文件夹: ` + this.releasePath);
    await ensureDir(this.releasePath);
  }
  private async cleanReleaseFilePath() {
    if (!this.options.clean) {
      return;
    }
    this.log.log(`[开始] 删除可能的重名文件: ` + this.releaseFilePath);
    // 如果有同名应该先删除
    await remove(this.releaseFilePath);
    this.log.log(`[结束] 删除可能的重名文件: ` + this.releaseFilePath);
  }
  // 这个打包选项就不让用户去关心了，直接写死
  private static getArchiveOptions(archiveType: ArchiveType): archiver.ArchiverOptions {
    if (archiveType === ArchiveType.tar) {
      return {
        gzip: true,
        gzipOptions: { level: 9 },
      };
    }
    return {
      zlib: { level: 9 }, // Sets the compression level.
    };
  }
  private async save() {
    // 打包
    const archive = archiver(this.options.archiveType, Release.getArchiveOptions(this.options.archiveType));
    // 这里是文件夹
    const outputStream = createWriteStream(this.releaseFilePath);

    const result = await new Promise(async (resolve, reject) => {
      outputStream
        .on('close', () => {
          this.log.log('[close] 写入文件关闭，总共字节数: ' + archive.pointer());
        })
        .on('finish', () => {
          this.log.log('[finish] 写入文件完毕');
          resolve(true);
        });
      this.progressPrinter = new ProgressPrinter({
        buildMessage({ currentFrame }: any) {
          return `[Release] ${currentFrame} 打包推流中，此时进度为：${archive.pointer()}`;
        },
      });
      const onProgress = () => {
        this.progressPrinter?.print?.();
      };
      archive
        .on('progress', onProgress)
        .on('error', (err) => {
          this.log.error('[error] 打包推流,但失败，原因为：' + err.message);
          reject(err);
        })
        .on('warning', (err) => {
          if (err.code === 'ENOENT') {
            this.log.warn('[warning] 打包推流，但警告，原因为: ' + err.message);
          }
          this.log.error('[warning] 打包推流,但失败，原因为：' + err.message);
          reject(err);
        })
        .on('close', () => {
          resolve(true);
        })
        .pipe(outputStream);

      // 添加文件
      archive.glob(this.options.include, {
        ignore: this.options.exclude,
        skip: this.options.exclude,
        dot: true,
        cwd: this.options.workspace,
      });
      // 保存信息文件
      if (this.options.infoStore) {
        this.options.infoStore.save(archive);
      }
      // 执行
      this.log.log('[开始] 执行打包');
      // spinner.start();
      await archive.finalize();
      this.progressPrinter.end();
      process.stdout.write('\n'); // 用于换行
      this.log.log('[结束] 执行打包');
    });
    return result;
  }
  async start() {
    try {
      // 确保保存释放文件的文件夹存在
      await this.ensureReleasePath();
      // 如果已经有同名文件就清除
      await this.cleanReleaseFilePath();
      this.log.log(`[开始] 打包，文件为: ` + this.releaseFilePath);
      const result = await this.save();
      this.log.log(`[结束] 打包，文件为: ` + this.releaseFilePath);
      return result;
    } catch (error: any) {
      this.log.error('[错误] 打包，但失败，原因为：' + error.message);
      throw error;
    }
  }
}
