import { delimiter } from 'path';
import { loadConfig } from '../lib';

async function bootstrap() {
  console.log(loadConfig('package.json'));
  console.log(loadConfig('./src/.env'));
  console.log(loadConfig('./src/.env', { delimiter: '_' }));
  console.log(loadConfig('./src/test.xml'));
  console.log('./src/test.js', await loadConfig('./src/test.js'));
  console.log('./src/test.mjs', await loadConfig('./src/test.mjs'));
  console.log('./src/test.ts', await loadConfig('./src/test.ts'));
  console.log('./src/test.xlsx', await loadConfig('./src/test.xlsx'));
}
bootstrap();
