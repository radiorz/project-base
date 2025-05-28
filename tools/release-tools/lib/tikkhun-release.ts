/**
 * @author
 * @file tikkhun-release.ts
 * @fileBase tikkhun-release
 * @path tools\release-tools\lib\tikkhun-release.ts
 * @from
 * @desc tikkhun主要扁平化了release 的选项,不用创建对象与function
 * @example
 */
import { mergeOptions } from '@tikkhun/utils-core';
import { Release, ReleaseOptions } from '@tikkhun/release-core';
import { ReleaseInfoStoreOptions, ReleaseInfoStorePlugin } from '../../release-plugins/info-store/lib/info-store.plugin';
import { InfoString, InfoStringOptions } from './info-string';
import _ from 'lodash';
import { Logger } from '@tikkhun/logger';
import { InputMovePlugin, InputMovePluginOptions } from './plugins';
import { getInfo, GetInfoOptions } from './info';
const { omit } = _;
export interface TikkhunReleaseDefaultOptions
  extends Omit<ReleaseOptions, 'infoStore' | 'info' | 'releaseName' | 'plugins'> {
  // 这个主要集中在info的输入与获取方式
  getInfoOptions: GetInfoOptions;
  // 存储info的文件
  infoStoreOptions: Partial<{ enabled: boolean } & ReleaseInfoStoreOptions>;
  // 释放文件的名称
  releaseNameOptions: Partial<InfoStringOptions>;
  // 重命名文件
  inputMoveOptions: Partial<InputMovePluginOptions>;
}
export const TikkhunReleaseDefaultOptions = {
  ...omit(Release.defaultOptions, ['infoStore', 'info', 'releaseName']),
  getInfoOptions: {
    from: [
      [
        'package.json',
        {
          name: 'name',
          version: 'version',
          description: 'description',
          tag: 'tag',
          system: 'system',
          hardware: 'hardware',
        },
      ],
    ],
  },
  infoStoreOptions: {
    enabled: true,
    ...omit(ReleaseInfoStorePlugin.defaultOptions, ['info']),
  },
  releaseNameOptions: omit(InfoString.defaultOptions, ['info']),
  // 重命名的文件列表
  inputMoveOptions: InputMovePlugin.defaultOptions,
};
const logger = new Logger('TikkhunRelease');

export async function TikkhunRelease(options?: Partial<TikkhunReleaseDefaultOptions>) {
  // 记录时间.
  console.time('tikkhun-release');
  const opts: TikkhunReleaseDefaultOptions = mergeOptions(TikkhunReleaseDefaultOptions, options);
  logger.log('[说明] 最终配置参数: ' + JSON.stringify(opts, null, 2));
  const { infoStoreOptions, getInfoOptions, releaseNameOptions, inputMoveOptions, ...releaseOptions } = opts;
  const info = await getInfo(getInfoOptions);
  logger.log('[说明] 项目信息:' + JSON.stringify(info, null, 2));
  const releaseNameBuilder = new InfoString({ ...releaseNameOptions, info });
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
