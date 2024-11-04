import { optionsMerge } from '@tikkhun/utils-core';
import { InfoBuilder, InfoBuilderOptions } from './info-builder';
import { Release, ReleaseOptions } from './release';
import { ReleaseInfoStoreOptions, ReleaseInfoStorePlugin } from './plugins/info-store.plugin';
import { ReleaseName, ReleaseNameOptions } from './release-name';
import _ from 'lodash';
import { Logger } from '@tikkhun/logger';
import { InputMovePlugin, InputMovePluginOptions } from './plugins';
import { InputMoveOption } from './plugins/input-move.plugin';
const { omit } = _;
export interface TikkhunReleaseDefaultOptions
  extends Omit<ReleaseOptions, 'infoStore' | 'info' | 'releaseName' | 'plugins'> {
  // 这个主要集中在info的输入与获取方式
  infoBuilderOptions: Partial<InfoBuilderOptions>;
  // 存储info的文件
  infoStoreOptions: Partial<{ enabled: boolean } & ReleaseInfoStoreOptions>;
  // 释放文件的名称
  releaseNameOptions: Partial<ReleaseNameOptions>;
  // 重命名文件
  inputMoveOptions: Partial<InputMovePluginOptions>;
}
export const TikkhunReleaseDefaultOptions = {
  ...omit(Release.defaultOptions, ['infoStore', 'info', 'releaseName']),
  infoBuilderOptions: InfoBuilder.defaultOptions,
  infoStoreOptions: {
    enabled: true,
    ...omit(ReleaseInfoStorePlugin.defaultOptions, ['info']),
  },
  releaseNameOptions: omit(ReleaseName.defaultOptions, ['info']),
  // 重命名的文件列表
  inputMoveOptions: InputMovePlugin.defaultOptions,
};
const logger = new Logger('TikkhunRelease');

export async function TikkhunRelease(options: TikkhunReleaseDefaultOptions) {
  // 记录时间.
  console.time('tikkhun-release');
  const opts: TikkhunReleaseDefaultOptions = optionsMerge(TikkhunReleaseDefaultOptions, options);
  logger.log('[说明] 最终配置参数: ' + JSON.stringify(opts, null, 2));
  const { infoStoreOptions, infoBuilderOptions, releaseNameOptions, inputMoveOptions, ...releaseOptions } = opts;
  const infoBuilder = new InfoBuilder(infoBuilderOptions);
  const info = infoBuilder.get();
  logger.log('[说明] 项目信息: ' + JSON.stringify(info));
  const releaseNameBuilder = new ReleaseName({ ...releaseNameOptions, info });
  const releaseName = releaseNameBuilder.stringify();
  logger.log('[说明] 项目打包名称: ' + releaseName);
  // release 的额外功能通过插件方式实现
  const plugins: any[] = [];
  if (infoStoreOptions?.enabled) {
    const releaseInfoStorePlugin = new ReleaseInfoStorePlugin({ ...infoStoreOptions, info });
    plugins.push(releaseInfoStorePlugin);
  }
  if (inputMoveOptions) {
    const inputMovePlugins = new InputMovePlugin(inputMoveOptions);
    plugins.push(inputMovePlugins);
  }
  const release = new Release({
    ...releaseOptions,
    releaseName,
    plugins,
  });
  await release.start();
  console.timeEnd('tikkhun-release');
}
