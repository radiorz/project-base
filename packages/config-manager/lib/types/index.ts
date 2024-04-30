export * from "./module-manager.types";

export interface ConfigSchema {
  scope: Scope;
  getDefaultValues(): ConfigData;
  getJSONSchema(): Record<string, any>;
  validate(data: Record<string, any>): boolean;
}

export type ConfigModuleKey = string; // 比如 db logger



export interface CacheOptions {
  force?: boolean;
}
export interface ConfigStoreFindAllOptions extends CacheOptions {}
export interface ConfigStoreFindUniqueOptions extends CacheOptions {
  id?: ConfigRecordId;
}
export interface ConfigStoreFindAllOptions extends CacheOptions {}
export interface ConfigStoreFindUniqueOptions extends CacheOptions {
  id?: ConfigRecordId;
}
export interface ConfigStoreSaveUniqueOptions {
  id?: ConfigRecordId;
}

export interface ConfigStore {
  scope: Scope;
  findAll(
    options?: ConfigStoreFindAllOptions
  ): ConfigRecord[] | Promise<ConfigRecord[]>;
  findUnique(
    options?: ConfigStoreFindUniqueOptions
  ): ConfigRecord | Promise<ConfigRecord>;
  saveAll(data: ConfigData[] | ConfigObject): boolean | Promise<boolean>;
  saveUnique(
    data: ConfigData,
    options: ConfigStoreSaveUniqueOptions
  ): boolean | Promise<boolean>;
}
