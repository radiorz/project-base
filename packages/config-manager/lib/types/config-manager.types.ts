import { FindModuleOptions, HasKey } from './module-manager.types';
import { ConfigSchema } from './config-schema.types';
import { ConfigStore } from './config-store.types';
import { ModuleKey, ModuleManager } from './module-manager.types';
export type ConfigData = Record<string, any> | null | undefined;
export type ConfigRecordId = string | number;
export interface ConfigRecord {
  id: ConfigRecordId;
  config: ConfigData;
}

export type Scope = 'APP' | 'DEPT' | 'USER';
export type ConfigModuleKey = ModuleKey;
export interface ConfigModule extends HasKey {
  schemas: Map<ConfigSchema['scope'], ConfigSchema>;
  schema: ConfigSchema;
  stores: Map<ConfigStore['scope'], ConfigStore>;
  addStore(store: ConfigStore): ConfigModule;
  removeStore(store: ConfigStore): boolean;
  addSchema(scope: Scope, schema: ConfigSchema): ConfigModule;
  removeSchema(schema: ConfigSchema): boolean;
}

export interface FindAllOptions extends FindModuleOptions {
  scope?: Scope;
  path?: string;
}
export interface GetSchemaOptions extends FindModuleOptions {
  path?: string;
}
export interface FindUniqueOptions extends FindModuleOptions {}
export interface GetOptions extends FindModuleOptions {}
export interface SetOptions extends FindModuleOptions {}
export interface ResetOptions extends FindModuleOptions {}

export interface ConfigManagerApi {
  // preload
  // schema
  getSchema(options?: GetSchemaOptions): Record<string, any>;
  // config api
  findAll(options?: FindAllOptions): Promise<ConfigRecord[]>;
  findUnique(options?: FindUniqueOptions): Promise<ConfigRecord>;
  get(options?: GetOptions): Promise<ConfigRecord>;
  set(data: Record<string, any>, options?: SetOptions): boolean | Promise<boolean>;
  reset(options?: SetOptions): boolean | Promise<boolean>;
  // 变化
  subscribeInit(callback: Function): void; // load
  subscribeChange(callback: Function): void;
}
export interface ConfigManager extends ModuleManager<ConfigModule>, ConfigManagerApi {
  load(): void; // 初始化加载配置文件(一般app的加载就行了)
}
