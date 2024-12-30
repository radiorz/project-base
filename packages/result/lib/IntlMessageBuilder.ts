/**
 * @author
 * @file I18nMessageBuilder.ts
 * @fileBase I18nMessageBuilder
 * @path packages\result\lib\I18nMessageBuilder.ts
 * @from
 * @desc
 * @example
 */

import { get } from 'lodash';

export interface I18nMessageBuilderOptions {
  language: string;
  languageMessages: Map<string, JSON>;
}

export class I18nMessageBuilder {
  static options: I18nMessageBuilderOptions = {
    language: 'zh',
    languageMessages: new Map<string, JSON>(),
  };
  options: I18nMessageBuilderOptions;
  constructor(options?: Partial<I18nMessageBuilderOptions>) {
    this.options = Object.assign({}, I18nMessageBuilder.options, options);
  }
  addLanguage(language: string, messages: JSON) {
    this.options.languageMessages.set(language, messages);
  }
  changeLanguage(language: string) {
    this.options.language = language;
  }
  t(path: string) {
    const languageMessages = this.options.languageMessages.get(this.options.language);
    return get(languageMessages, path);
  }
}
