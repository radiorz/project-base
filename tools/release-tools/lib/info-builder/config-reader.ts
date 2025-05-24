import { mergeOptions } from '@tikkhun/utils-core';
import fsExtra from 'fs-extra';
import { join } from 'path';
import _ from 'lodash';
const { get } = _;
import { loadConfig } from '@tikkhun/config-loader';
/**
 * @author
 * @file PackageJsonConfigReader.ts
 * @fileBase PackageJsonConfigReader
 * @path tools\release-tools\lib\InfoBuilder\PackageJsonConfigReader.ts
 * @from
 * @desc
 * @example
 */
export interface ConfigReaderOptions {
  path: string;
  nameKey: string;
  titleKey: string;
  descriptionKey: string;
  versionKey: string;
}

export class ConfigReader {
  static defaultOptions: ConfigReaderOptions = {
    path: join(process.cwd(), 'package.json'),
    nameKey: 'name',
    titleKey: 'title',
    descriptionKey: 'description',
    versionKey: 'version',
  };
  options: ConfigReaderOptions;
  config?: Record<string, any>;
  constructor(options?: Partial<ConfigReaderOptions>) {
    // console.log(options);
    this.options = mergeOptions(ConfigReader.defaultOptions, options);
    this.config = this.getConfig();
    // console.log(`this.config`, this.config);
  }

  private getConfig() {
    return loadConfig(this.options.path);
  }
  getName() {
    return get(this.config, this.options.nameKey);
  }
  getVersion() {
    return get(this.config, this.options.versionKey);
  }
  getTitle() {
    return get(this.config, this.options.titleKey);
  }
  getDescription() {
    return get(this.config, this.options.descriptionKey);
  }
}
