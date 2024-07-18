import { TimedTaskManager, Ticker } from '../lib';

const cron = new TimedTaskManager({ ticker: new Ticker() });
cron.addJob({
  timestamp: Date.now() + 5000,
  onTick(now: number) {
    console.log(`now`, now);
  },
});
