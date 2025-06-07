/**
 * @author
 * @file module.ts
 * @fileBase module
 * @path packages\module-core\lib\module.ts
 * @from
 * @desc
 * @example
 */
import mitt from 'mitt';

export interface ModuleOptions {
  name: string; // 模块名称
}

export class Module {
  static defaultOptions: ModuleOptions = Object.freeze({
    name: Math.random().toString(36).substring(2, 15),
  });
  options: ModuleOptions;
  emitter = mitt();
  on = this.emitter.on.bind(this);
  emit = this.emitter.emit.bind(this);
  connectMap: Map<Module, boolean> = new Map();
  constructor(options?: Partial<ModuleOptions>) {
    this.options = Object.assign({}, Module.defaultOptions, options);
  }
  connect(module: Module) {
    this.connectMap.set(module, true);
    module.emitter.on('*', (data: any) => {});
    this.emitter.on(module.options.name, (data: any) => {});
  }
}
