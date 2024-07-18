/**
 * @author
 * @file Cron.ts
 * @fileBase Cron
 * @path packages\timer\lib\Cron.ts
 * @from
 * @desc
 * @todo
 *
 *
 * @done
 * @example
 */

import { Logger } from '@tikkhun/logger';
import { Ticker } from '.';
import { ITimer } from './ITimer';
import { getRandom } from './utils';
export interface Job {
  timestamp: number;
  onTick(now: number): void;
}
export interface Options {
  ticker: Ticker | null;
}
export const DEFAULT_OPTIONS = {
  ticker: null,
};
export class TimedTaskManager implements ITimer {
  id = getRandom();
  logger = new Logger(this.id);
  options: Options;
  constructor(options?: Partial<Options>) {
    this.options = Object.assign(DEFAULT_OPTIONS, options);
    this.onTime = this.onTime.bind(this);
    this.onStart = this.onStart.bind(this);
    this.onStop = this.onStop.bind(this);
    this.options.ticker?.addTimer(this);
  }
  onTime(now: number): void {
    // 判断是否jobs 到点了
    this.jobs.forEach((job, id) => {
      const isOnTime = Cron.isOnNow(now, job.timestamp, this.options.ticker!.options.accuracy);
      if (isOnTime) {
        job.onTick(now);
        this.jobs.delete(id);
      }
    });
  }
  static isOnNow(now: number, timestamp: number, accuracy: number) {
    console.log(`now,timestamp,accuracy`, now, timestamp, accuracy);
    return now - timestamp > 0 && now - timestamp < accuracy;
  }
  onStart(): void {
    this.logger.debug!('cron is start');
  }
  onStop(): void {
    this.logger.debug!('cron is start');
  }
  jobs = new Map<string, Job>();
  addJob(job: Job) {
    const id = getRandom();
    this.jobs.set(id, job);
    return id;
  }
  removeJobById(id: string) {
    this.jobs.delete(id);
  }
}
