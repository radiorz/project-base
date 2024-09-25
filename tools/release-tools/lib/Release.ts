import { Logger } from '@tikkhun/logger';
import archiver from 'archiver';
import fsExtra from 'fs-extra';
const { removeSync, remove, createWriteStream } = fsExtra;
import _ from 'lodash';
import { join } from 'path';
import { ProjectInfoImpl, ProjectInfoOptions } from './ProjectInfo';
import { ensureDir } from './utils';
const logger = new Logger('Release');
const { merge } = _;
export enum ArchiveType {
  zip = 'zip',
  tar = 'tar',
}
// 目前想到的就是用  archive 进行打包。
export interface ProjectInfoSaveOptions {
  fileName: {
    enabled: boolean;
  };
  file: {
    enabled: boolean;
    path: string;
  };
}
export interface ReleaseOptions {
  /* # 打包源头 */
  workspace: string;
  include: string[];
  exclude: string[];
  /* ## 打包的压缩类型 */
  archiveType: ArchiveType;
  // archiveOptions: Record<string, any>;
  /* # 存放相关 */
  /* ## 文件名称 */
  releasePath: string; // 释放的路径
  projectInfoOptions: Partial<ProjectInfoOptions> & Partial<ProjectInfoSaveOptions>;
  /* ## 是否清空 */
  clean: boolean;
}
export const ExtensionMap = {
  [ArchiveType.zip]: '.zip',
  [ArchiveType.tar]: '.tar.gz', // 直接压缩
  // [ArchiveType.tar]: '.tar.gz',
};

export class Release {
  static defaultProjectInfoSaveOptions = {
    fileName: {
      enabled: true,
    },
    file: {
      enabled: true,
      path: 'release.json',
    },
  };
  static defaultOptions: ReleaseOptions = {
    workspace: process.cwd(),
    include: ['**/*'],
    exclude: ['**/node_modules', '**/release', '**/deploy', '**/.git', '**/.vscode'],
    archiveType: ArchiveType.zip,
    clean: true,
    releasePath: 'release',
    projectInfoOptions: { ...ProjectInfoImpl.options, ...Release.defaultProjectInfoSaveOptions },
  };
  options: ReleaseOptions;
  projectInfo: ProjectInfoImpl;
  log = logger;
  get releaseFile() {
    if (this.options.projectInfoOptions?.fileName?.enabled) {
      return this.projectInfo.stringify() + ExtensionMap[this.options.archiveType];
    }
    return 'release' + ExtensionMap[this.options.archiveType];
  }
  get releasePath() {
    return join(this.options.workspace, this.options.releasePath);
  }
  get releaseFilePath() {
    return join(this.releasePath, this.releaseFile);
  }
  constructor(options?: Partial<ReleaseOptions>) {
    this.options = merge({}, Release.defaultOptions, options);
    this.log.debug!('初始化release tools,配置为: ' + JSON.stringify(this.options, null, 2));
    // 项目信息
    this.projectInfo = new ProjectInfoImpl(this.options.projectInfoOptions);
    this.watchError();
  }

  watchError() {
    // TODO 当 ctrl+c 删除target文件
    process.on('SIGINT', () => {
      this.clean();
    });
  }
  clean() {
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

      archive
        .on('progress', (progress) => {
          // console.log(progress);
          this.log.log('[progress] 打包推流，当前进度为：' + JSON.stringify(archive.pointer()));
        })
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
      if (this.options.projectInfoOptions.file?.enabled) {
        archive.append(JSON.stringify(this.projectInfo.toJson(), null, 2), {
          name: this.options.projectInfoOptions.file?.path,
        });
      }
      // 执行
      this.log.log('[开始] 执行打包');
      // spinner.start();
      await archive.finalize();
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
      this.log.log('[说明] 项目信息: ' + JSON.stringify(this.projectInfo.toJson()));
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
