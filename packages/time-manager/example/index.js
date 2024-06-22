const { Ticker } = require('../dist/index.js');

const ticker = new Ticker();
setTimeout(() => {
  console.log(`ticker`,ticker)
  ticker.stop();
}, 2000);
