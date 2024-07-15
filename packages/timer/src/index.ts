import { Timer, Ticker } from '../lib';
const ticker = new Ticker();
const timer = new Timer({
  isOnTime: 'second',
  onTime: (now) => {
    console.log(`timer1`, now);
  },
});

const timer2 = new Timer({
  ticker,
  isOnTime: 'second',
  onTime: (now) => {
    console.log(`timer2`, now);
  },
});
const timer3 = new Timer({
  ticker,
  isOnTime: 'second',
  onTime: (now) => {
    console.log(`timer3`, now);
  },
});
timer.init(ticker).start();
setTimeout(() => {
  timer2.stop();
}, 3000);
setTimeout(() => {
  timer.stop();
}, 2000);
setTimeout(() => {
  timer3.stop();
}, 4000);
