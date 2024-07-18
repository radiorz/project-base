import { Cron, Ticker } from '../lib';

const cron = new Cron({ ticker: new Ticker() });
cron.addJob({
  timestamp: Date.now() + 5000,
  onTick(now: number) {
    console.log(`now`, now);
  },
});
