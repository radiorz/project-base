import { optionsMerge } from '@tikkhun/utils-core';
import { InfoBuilder, InfoBuilderOptions } from './InfoBuilder';
import { Release, ReleaseOptions } from './Release';
import { ReleaseInfoStore, ReleaseInfoStoreOptions, ReleaseInfoStorePlugin } from './ReleaseInfoStorePlugin';
import { ReleaseName, ReleaseNameOptions } from './ReleaseName';
import _ from 'lodash';
import { Logger } from '@tikkhun/logger';
const { omit } = _;
export interface TikkhunReleaseDefaultOptions extends Omit<ReleaseOptions, 'infoStore' | 'info' | 'releaseName'> {
  // 这个主要集中在info的输入与获取方式
  infoBuilderOptions: Partial<InfoBuilderOptions>;
  // 存储info的文件
  infoStoreOptions: Partial<{ enabled: boolean } & ReleaseInfoStoreOptions>;
  // 释放文件的名称
  releaseNameOptions: Partial<ReleaseNameOptions>;
}
export const TikkhunReleaseDefaultOptions = {
  ...omit(Release.defaultOptions, ['infoStore', 'info', 'releaseName']),
  infoBuilderOptions: InfoBuilder.defaultOptions,
  infoStoreOptions: {
    enabled: true,
    ...omit(ReleaseInfoStore.defaultOptions, ['info']),
  },
  releaseNameOptions: omit(ReleaseName.defaultOptions, ['info']),
};
const logger = new Logger('TikkhunRelease');

export async function TikkhunRelease(options: TikkhunReleaseDefaultOptions) {
  const opts: TikkhunReleaseDefaultOptions = optionsMerge(TikkhunReleaseDefaultOptions, options);
  logger.debug!('[说明] 配置参数: ' + JSON.stringify(options, null, 2));
  const { infoStoreOptions, infoBuilderOptions, releaseNameOptions, ...releaseOptions } = opts;
  const infoBuilder = new InfoBuilder(infoBuilderOptions);
  const info = infoBuilder.get();
  logger.log('[说明] 项目信息: ' + JSON.stringify(info));
  const releaseNameBuilder = new ReleaseName({ ...releaseNameOptions, info });
  const releaseName = releaseNameBuilder.stringify();
  logger.log('[说明] 项目打包名称: ' + releaseName);
  // release 的额外功能通过插件方式实现
  const plugins: any[] = [];
  if (infoStoreOptions?.enabled) {
    const releaseInfoStorePlugin = new ReleaseInfoStore({ ...infoStoreOptions, info });
    plugins.push(releaseInfoStorePlugin);
  }
  const release = new Release({
    ...releaseOptions,
    releaseName,
    plugins,
  });
  await release.start();
}