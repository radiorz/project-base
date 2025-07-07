export type Config = Record<string, any>;
export type convertToConfig = (data: any, options?: any) => Config | Promise<Config>;
export type convertFromConfig = (config: Config, options?: any) => any | Promise<any>;
export type loadFromFile<T = any> = (filePath: string, options?: T) => Promise<Config> | Config;
export type saveToFile = (config: Config, filePath: string, options?: any) => Promise<void> | void;

export enum FILE_TYPES {
  javascript = 'javascript',
  json = 'json',
  json5 = 'json5',
  yaml = 'yaml',
  typescript = 'typescript',
  env = 'env',
  toml = 'toml',
  xml = 'xml',
  sheet = 'sheet',
  dotNodeVersion = 'dotNodeVersion',
}
