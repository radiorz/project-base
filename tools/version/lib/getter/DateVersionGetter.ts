import dayjs from 'dayjs';
import { Logger } from '@tikkhun/logger';
import { Getter } from './Getter';
export interface Options {
  pattern: string;
}
export const DEFAULT_DATE_VERSION_GETTER_OPTIONS = {
  pattern: 'YYYY.MM.DD',
};
export class DateVersionGetter implements Getter {
  log = new Logger(this.constructor.name);

  static get(pattern: string) {
    return dayjs().format(pattern);
  }

  options: Options;
  constructor(options?: Partial<Options>) {
    this.options = Object.assign({}, DEFAULT_DATE_VERSION_GETTER_OPTIONS, options);
  }
  get() {
    return DateVersionGetter.get(this.options.pattern);
  }
}
