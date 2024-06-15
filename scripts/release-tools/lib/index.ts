// 目前想到的就是用  archive 进行打包。
interface Options {
  include: string[];
  exclude: string[];
}
const DEFAULT_OPTIONS = {
  include: ['**/*'],
  exclude: [],
};
class Release {
  options: Options;
  constructor(options?: Partial<Options>) {
    this.options = Object.assign(DEFAULT_OPTIONS, options);
  }
  start() {
    
  }
}
