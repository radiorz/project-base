import { Logger } from '@tikkhun/logger';
import { Emitter } from './Emitter';
import { ITimer } from './ITimer';
import { getRandom } from './utils';
//
export interface TickerOptions {
  accuracy: number; // 这个用毫秒 多久调用一次getNow
  getNow: () => number;
  start: boolean;
}
export const defaultTickerOptions: TickerOptions = {
  accuracy: 500,
  getNow: () => Date.now(),
  start: true,
};
export abstract class AbstractTicker extends Emitter {
  id = getRandom();
  logger = new Logger(this.id);
  options: TickerOptions;
  isStart = false;
  now = Date.now();
  timers = new Set<ITimer>();
  [key: string]: any;
  constructor(options?: Partial<TickerOptions>) {
    super();
    this.options = Object.assign(defaultTickerOptions, options);
    this.onStart = this.onStart.bind(this);
    this.onStop = this.onStop.bind(this);
    if (this.options.start) this.start();
  }
  async updateNow() {
    this.now = await this.options.getNow();
    this.emit('change', this.now);
  }

  addTimer(timer: ITimer) {
    if (this.timers.has(timer)) {
      return;
    }
    this.on('change', timer.onTime);
    this.on('stop', timer.onStop);
    this.on('start', timer.onStart);
    this.timers.add(timer);
  }
  removeTimer(timer: ITimer) {
    if (!this.timers.has(timer)) {
      return;
    }
    this.off('change', timer.onTime);
    this.off('stop', timer.onStop);
    this.off('start', timer.onStart);
    this.timers.delete(timer);
    if (!this.timers.size) {
      this.stop();
    }
  }
  onStop() {
    this.emit('stop');
  }
  onStart() {
    this.emit('start');
  }
  abstract start(): void;
  abstract stop(): void;
}
// IntervalTicker
export class Ticker extends AbstractTicker {
  logger = new Logger(this.id);
  private _intervalId: ReturnType<typeof setInterval> | undefined; // 这里不能赋予初值
  start() {
    // 不重复进入
    if (this.isStart) {
      return;
    }
    this.isStart = true;
    this.onStart();
    this._intervalId = setInterval(() => {
      this.updateNow();
    }, this.options.accuracy);
  }
  onStop(): void {
    super.onStop();
    this.logger.debug!('ticker is stop');
  }
  onStart(): void {
    super.onStart();
    this.logger.debug!('ticker is start');
  }
  stop() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      delete this._intervalId;
    }
    this.isStart = false;
    this.onStop();
  }
}
