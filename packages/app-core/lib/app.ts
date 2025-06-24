/**
 * @author
 * @file app.ts
 * @fileBase app
 * @path packages\app-core\lib\app.ts
 * @from
 * @desc
 * @example
 */
export interface AppOptions {
  modules: Module[];
}
export class BaseApp implements App {
  static defaultOptions: AppOptions = Object.freeze({
    modules: [],
  });
  options: AppOptions;
  messenger: Messenger;
  constructor(options?: Partial<AppOptions>) {
    this.options = Object.assign({}, App.defaultOptions, options);
  }
  module(module: Module) {
    return;
  }
}

class Module {}
