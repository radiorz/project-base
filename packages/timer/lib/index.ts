import { Logger } from '@tikkhun/logger';
let crypto: any;
if (typeof window !== 'undefined' && window.crypto) {
  crypto = window.crypto;
} else {
  crypto = require('node:crypto');
}
type EventCallback = (...args: any[]) => void;

class Emitter {
  private listeners: { [eventName: string]: EventCallback[] } = {};

  on(eventName: string, callback: EventCallback) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
  }

  off(eventName: string, callback: EventCallback) {
    if (this.listeners[eventName]) {
      this.listeners[eventName] = this.listeners[eventName].filter((listener) => listener !== callback);
    }
  }

  emit(eventName: string, ...args: any[]) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach((callback) => {
        callback(...args);
      });
    }
  }
}

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
  id = crypto.randomUUID();
  options: TickerOptions;
  isStart = false;
  now = Date.now();
  timers = new Set<Timer>();
  [key: string]: any;
  constructor(options?: Partial<TickerOptions>) {
    super();
    this.options = Object.assign(defaultTickerOptions, options);
    if (this.options.start) this.start();
  }
  async updateNow() {
    this.now = await this.options.getNow();
    this.emit('change', this.now);
  }

  addTimer(timer: Timer) {
    if (this.timers.has(timer)) {
      return;
    }
    this.on('change', timer.onTime);
    this.on('stop', timer.onStop);
    this.on('start', timer.onStart);
    this.timers.add(timer);
  }
  removeTimer(timer: Timer) {
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
export class Timer {
  id = crypto.randomUUID();
  options: ReallyTimerOptions;
  isOnTime: (now: number) => boolean = (now: number) => true;
  logger = new Logger(this.id);
  constructor(options?: Partial<TimerOptions>) {
    const defaultOptions = getDefaultTimerOptions();
    if (defaultOptions.ticker === true) {
      defaultOptions.ticker = new Ticker({ start: false });
    }
    this.options = Object.assign(defaultOptions as ReallyTimerOptions, options);
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
  get ticker(): Ticker | null {
    return this.options.ticker as Ticker | null;
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
