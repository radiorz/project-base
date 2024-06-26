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
    this.timers.add(timer);
  }
  removeTimer(timer: Timer) {
    if (!this.timers.has(timer)) {
      return;
    }
    this.timers.delete(timer);
    if (!this.timers.size) {
      this.stop();
    }
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
    this._intervalId = setInterval(() => {
      this.updateNow();
    }, this.options.accuracy);
  }
  stop() {
    if (this.timers.size) {
      return;
    }
    if (this._intervalId) {
      clearInterval(this._intervalId);
      delete this._intervalId;
    }
    this.isStart = false;
    this.logger.debug!('ticker is stop');
  }
}
// 定时器
export const oneSecondMillis = 1 * 1000;
export const oneMinuteMillis = 60 * 1000;
export const oneHourMillis = 3600 * 1000;
export const oneDayMillis = 3600 * 1000 * 24;

export interface TimerOptions {
  ticker: Ticker;
  isOnTime: 'day' | 'hour' | 'minute' | 'second' | ((now: number) => boolean);
  onTime: (now: number) => void;
  start: true;
}

//
export function getDefaultTimerOptions(): TimerOptions {
  return {
    ticker: new Ticker({ start: false }),
    isOnTime: (now: number) => true,
    onTime: () => {},
    start: true,
  };
}

export class Timer {
  id = crypto.randomUUID();
  options: TimerOptions;
  isOnTime: (now: number) => boolean = (now: number) => true;
  logger = new Logger(this.id);
  constructor(options?: Partial<TimerOptions>) {
    this.options = Object.assign(getDefaultTimerOptions(), options);
    this.setIsOnTime();
    this.onTime = this.onTime.bind(this);
    this.init();
    if (this.options.start) this.start();
  }
  setIsOnTime() {
    if (typeof this.options.isOnTime === 'string') {
      if (this.options.isOnTime === 'hour') {
        this.isOnTime = (now: number) => Timer.isOnHour(now, this.options.ticker.options.accuracy);
      } else if (this.options.isOnTime === 'minute') {
        this.isOnTime = (now: number) => Timer.isOnMinute(now, this.options.ticker.options.accuracy);
      } else if (this.options.isOnTime === 'day') {
        this.isOnTime = (now: number) => Timer.isOnDay(now, this.options.ticker.options.accuracy);
      } else if (this.options.isOnTime === 'second') {
        this.isOnTime = (now: number) => Timer.isOnSecond(now, this.options.ticker.options.accuracy);
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
  init() {
    this.options.ticker.on('change', this.onTime);
    this.options.ticker.addTimer(this);
  }
  start() {
    this.options.ticker.start();
  }
  stop() {
    this.options.ticker.off('change', this.onTime);
    this.options.ticker.removeTimer(this);
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
