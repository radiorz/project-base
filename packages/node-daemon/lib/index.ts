import { EventEmitter } from 'events';
import { Logger } from '@tikkhun/logger';
const log = new Logger('Daemon');



// 检测内存使用情况的阈值（以字节为单位）
const TOTAL_MEMORY_THRESHOLD = 4 * 1024 * 1024 * 1024; // 8G
const MEMORY_THRESHOLD = 1024 * 1024 * 100; // 100M
const RESTART_INTERVAL = 1000 * 60 * 30; // 半小时
interface DaemonOptions {}
const defaultDaemonOptions: DaemonOptions = {
  onMemoryNearEmpty() {},
  onError() {
    log.error('');
  },
};
class Daemon extends EventEmitter {
  opts: DaemonOptions;
  constructor(options: DaemonOptions) {
    super();
    this.opts = Object.assign(defaultDaemonOptions, options);
  }
  checkMemoryUsage() {
    const freeMemory = os.freemem();
    if(freeMemory < MEMORY_)
  }
  start() {}
  async stop() {}
}
