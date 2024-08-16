import { Logger } from '@tikkhun/logger';
import { Ticker, defaultTickerOptions } from './Ticker';
import { ITimer } from './ITimer';
import { getRandom } from './utils';

// 定时器
export const oneSecondMillis = 1 * 1000;
export const oneMinuteMillis = 60 * 1000;
export const oneHourMillis = 3600 * 1000;
export const oneDayMillis = 3600 * 1000 * 24;

export interface TimerOptions {
  ticker: Ticker | true | null;
  isOnTime: 'day' | 'hour' | 'minute' | 'second' | ((now: number) => boolean);
  onTime: (now: number) => void;
  start: true;
}

//
export function getDefaultTimerOptions(): TimerOptions {
  return {
    ticker: null,
    isOnTime: (now: number) => true,
    onTime: () => {},
    start: true,
  };
}
export interface ReallyTimerOptions {
  ticker: Ticker | null;
  isOnTime: 'day' | 'hour' | 'minute' | 'second' | ((now: number) => boolean);
  onTime: (now: number) => void;
  start: true;
}
export class Timer implements ITimer {
  id = getRandom();
  options: ReallyTimerOptions;
  isOnTime: (now: number) => boolean = (now: number) => true;
  logger = new Logger(this.id);
  constructor(options?: Partial<TimerOptions>) {
    const defaultOptions = getDefaultTimerOptions();
    if (defaultOptions.ticker === true) {
      defaultOptions.ticker = new Ticker({ start: false });
    }
    this.options = Object.assign({}, defaultOptions as ReallyTimerOptions, options);
    this.setIsOnTime();
    this.onTime = this.onTime.bind(this);
    this.onStop = this.onStop.bind(this);
    this.onStart = this.onStart.bind(this);
    if (this.options.ticker) this.init();
    if (this.options.ticker && this.options.start) this.start();
  }
  setIsOnTime() {
    if (typeof this.options.isOnTime === 'string') {
      if (this.options.isOnTime === 'hour') {
        this.isOnTime = (now: number) =>
          Timer.isOnHour(now, this.options.ticker?.options.accuracy || defaultTickerOptions.accuracy);
      } else if (this.options.isOnTime === 'minute') {
        this.isOnTime = (now: number) =>
          Timer.isOnMinute(now, this.options.ticker?.options.accuracy || defaultTickerOptions.accuracy);
      } else if (this.options.isOnTime === 'day') {
        this.isOnTime = (now: number) =>
          Timer.isOnDay(now, this.options.ticker?.options.accuracy || defaultTickerOptions.accuracy);
      } else if (this.options.isOnTime === 'second') {
        this.isOnTime = (now: number) =>
          Timer.isOnSecond(now, this.options.ticker?.options.accuracy || defaultTickerOptions.accuracy);
      } else {
        this.isOnTime = (now: number) => true;
      }
    } else {
      this.isOnTime = this.options.isOnTime;
    }
  }

  onTime(now: number) {
    const isOnTime = this.isOnTime(now);
    if (isOnTime) {
      this.options.onTime(now);
    }
  }
  init(ticker?: Ticker) {
    if (ticker) {
      this.options.ticker = ticker;
    }

    if (!this.options.ticker) {
      // 如果没有 ticker 就加上 ticker
      this.options.ticker = new Ticker({ start: false });
    }
    // 监听
    this.options.ticker.addTimer(this);
    return this;
  }
  get ticker(): Ticker {
    return this.options.ticker as Ticker;
  }
  set ticker(ticker: Ticker) {
    this.options.ticker = ticker;
  }
  start() {
    if (!this.options.ticker) {
      throw new Error('ticker is not defined');
    }
    this.options.ticker.start();
  }
  // pause(){}
  stop() {
    this.options.ticker?.removeTimer(this);
    this.onStop();
  }
  onStart() {
    this.logger.debug!('timer is start');
  }
  onStop() {
    this.logger.debug!('timer is stop');
  }
  static isTimestampOnNow(now: number, timestamp: number, accuracy: number): boolean {
    return now - timestamp < accuracy;
  }
  static isOnSecond(timestamp: number, accuracy: number): boolean {
    return timestamp % oneSecondMillis < accuracy;
  }
  static isOnMinute(timestamp: number, accuracy: number): boolean {
    return timestamp % oneMinuteMillis < accuracy;
  }

  static isOnHour(timestamp: number, accuracy: number): boolean {
    const isHourly = timestamp % oneHourMillis < accuracy;
    return isHourly;
  }
  static isOnDay(timestamp: number, accuracy: number): boolean {
    return timestamp % oneDayMillis < accuracy;
  }
}
