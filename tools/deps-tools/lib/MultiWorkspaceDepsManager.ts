/**
 * @author
 * @file MultiWorkspaceDepsManager.ts
 * @fileBase MultiWorkspaceDepsManager
 * @path tools\deps-tools\lib\MultiWorkspaceDepsManager.ts
 * @from
 * @desc
 * @example
 */
/**
 * # TODO
 * - 主要就是可以管理monorepo的依赖 发现 ncu 有了。。。。
 * # DONE
 * ## 20241212 星期四
 * # FUTURE
 */
export interface MultiWorkspaceDepsManagerOptions {
  include: string[];
  exclude: string[];
}

export class MultiWorkspaceDepsManager {
  static defaultOptions: MultiWorkspaceDepsManagerOptions = Object.freeze({
    include: ['**/package.json'],
    exclude: [],
  });
  options: MultiWorkspaceDepsManagerOptions;
  constructor(options?: Partial<MultiWorkspaceDepsManagerOptions>) {
    this.options = Object.assign({}, MultiWorkspaceDepsManager.defaultOptions, options);
  }
}
