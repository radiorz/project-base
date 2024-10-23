import { optionsMerge } from '@tikkhun/utils-core';
import fsExtra from 'fs-extra';
import { join } from 'path';
import { readXmlSync } from './config-reader.utils';
import _ from 'lodash';
const { get } = _;
const { readJsonSync } = fsExtra;
/**
 * @author
 * @file PackageJsonConfigReader.ts
 * @fileBase PackageJsonConfigReader
 * @path tools\release-tools\lib\InfoBuilder\PackageJsonConfigReader.ts
 * @from
 * @desc
 * @example
 */
export type ConfigType = 'xml' | 'json';
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
  type?: ConfigType;
  constructor(options?: Partial<ConfigReaderOptions>) {
    // console.log(options);
    this.options = optionsMerge(ConfigReader.defaultOptions, options);
    this.type = this.getType();
    this.config = this.getConfig();
    // console.log(`this.config`, this.config);
  }

  private getType(): ConfigType {
    if (this.options.path.endsWith('json')) {
      return 'json';
    } else {
      return 'xml';
    }
  }
  private getConfig() {
    if (this.type === 'json') {
      return readJsonSync(this.options.path);
    }
    if (this.type === 'xml') {
      return readXmlSync(this.options.path);
    }
    return null;
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
