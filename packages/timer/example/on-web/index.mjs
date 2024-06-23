import { Ticker } from '../../dist/index.mjs';

const ticker = new Ticker();
setTimeout(() => {
  console.log(`ticker`, ticker);
  ticker.stop();
}, 2000);
