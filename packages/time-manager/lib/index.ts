export default abstract class TimeManager {
  private _intervalId: ReturnType<typeof setInterval> | null = null;
  // return 时间戳的
  private _interval: number;
  private _now = Date.now();

  static oneMinuteMillis = 60 * 1000;
  static oneHourMillis = 3600 * 1000;
  static oneDayMillis = 3600 * 1000 * 24;

  get now() {
    return this._now;
  }

  constructor(getTimeFunc: () => number = Date.now, interval: number = 500) {
    this._interval = interval;
    this.start(getTimeFunc, interval);
  }
  private _isMinutely(timestamp: number): boolean {
    return timestamp % TimeManager.oneMinuteMillis < this._interval;
  }

  private _isHourly(timestamp: number): boolean {
    const isHourly = timestamp % TimeManager.oneHourMillis < this._interval;
    return isHourly;
  }
  private _isDayly(timestamp: number): boolean {
    return timestamp % TimeManager.oneDayMillis < this._interval;
  }
  /**
   * 每分钟触发
   * @param now
   */
  // @OverRide
  public abstract onMinutely(now: number): any;
  /**
   * 每小时触发
   * @param now
   */
  // @override
  public abstract onHourly(now: number): any;
  /**
   * 每天触发
   * @param now
   */
  // @override
  public abstract onDayly(now: number): any;

  // @override
  public abstract onTimeChange(now: number): any;
  // 因为没有用 event 系统 所以要写这个回调
  private _onTimeChange(now: number): void {
    this.onTimeChange(now);
    setImmediate(() => {
      if (this._isMinutely(now)) {
        this.onMinutely(now);
      }
    });
    setImmediate(() => {
      if (this._isHourly(now)) {
        this.onHourly(now);
      }
    });
    setImmediate(() => {
      if (this._isDayly(now)) {
        this.onDayly(now);
      }
    });
  }

  start(getTimeFunc: Function, interval: number) {
    if (this._intervalId) {
      return;
    }
    this._intervalId = setInterval(() => {
      this._now = getTimeFunc();
      this._onTimeChange(this._now);
    }, interval);
  }

  end() {
    if (this._intervalId) clearInterval(this._intervalId);
  }
}
