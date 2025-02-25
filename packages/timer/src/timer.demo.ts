import { Timer } from '../lib';
const timer = new Timer({
  ticker: true,
  start: true, // 立即开始
  isOnTime: 'second',
  onTime: (now: number) => {
    console.log(`now`, now);
  },
});
console.log(`timer`, timer);
