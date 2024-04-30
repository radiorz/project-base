// 模块键
export type ModuleKey = string;
// 模块最基础的应该要有KEY
export interface HasKey {
  key: ModuleKey;
}
// 寻找
export interface FindModuleOptions {
  key?: ModuleKey;
}
export interface ModuleManager<Module extends HasKey> {
  keys(): ModuleKey[];
  has(moduleKey: ModuleKey): boolean;
  getModule(options?: FindModuleOptions): HasKey;
  register(module: Module): ModuleManager<Module>; //set
  unRegister(moduleKey: ModuleKey): boolean; // remove
  reRegister(module: Module): ModuleManager<Module>; // 重新注册
  clear(): boolean;
}
