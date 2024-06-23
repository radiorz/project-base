import { Ticker } from '../../dist/index.mjs';

const ticker = new Ticker();
ticker.on('change', (n) => {
  console.log(`n`, n);
});
setTimeout(() => {
  console.log(`ticker`, ticker);
  ticker.stop();
}, 2000);
