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

// 定时器
export const oneSecondMillis = 1 * 1000;
export const oneMinuteMillis = 60 * 1000;
export const oneHourMillis = 3600 * 1000;
export const oneDayMillis = 3600 * 1000 * 24;
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

export class Ticker extends Emitter {
  id = '' + Math.random();
  options: TickerOptions;
  private _intervalId: ReturnType<typeof setInterval> | null = null;
  isStart = false;
  now = Date.now();
  timers = new Set<Timer>();
  constructor(options?: Partial<TickerOptions>) {
    super();
    this.options = Object.assign(defaultTickerOptions, options);
    if (this.options.start) this.startInterval();
  }
  async updateNow() {
    this.now = await this.options.getNow();
    this.emit('change', this.now);
  }
  start(timer: Timer) {
    if (this.timers.has(timer)) {
      return;
    }
    this.timers.add(timer);
    this.startInterval();
  }
  stop(timer: Timer) {
    if (!this.timers.has(timer)) {
      return;
    }
    this.timers.delete(timer);
    if (!this.timers.size) {
      this.stopInterval();
    }
  }
  startInterval() {
    if (this.isStart) {
      return;
    }
    this.isStart = true;
    this._intervalId = setInterval(async () => {
      await this.updateNow();
    }, this.options.accuracy);
  }
  stopInterval() {
    if (this._intervalId) clearInterval(this._intervalId);
  }
}
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
  id = '' + Math.random();
  options: TimerOptions;
  isOnTime: (now: number) => boolean;
  constructor(options?: Partial<TimerOptions>) {
    this.options = Object.assign(getDefaultTimerOptions(), options);
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
      this.isOnTime = (now: number) => true;
    }
    this.onTime = this.onTime.bind(this);
    if (this.options.start) this.start();
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
  onTime(now: number) {
    const isOnTime = this.isOnTime(now);
    if (isOnTime) {
      this.options.onTime(now);
    }
  }
  stop() {
    this.options.ticker.off('change', this.onTime);
    this.options.ticker.stop(this);
  }
  start() {
    this.options.ticker.on('change', this.onTime);
    this.options.ticker.start(this);
  }
}
