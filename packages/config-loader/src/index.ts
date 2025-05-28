import { delimiter } from 'path';
import { loadConfig } from '../lib';

async function bootstrap() {
  console.log('package.json', loadConfig('package.json'));
  console.log('./src/.env', loadConfig('./src/.env'));
  console.log('./src/.env', loadConfig('./src/.env', { delimiter: '_' })); // 带参数
  console.log('./src/test.xml', loadConfig('./src/test.xml'));
  console.log('./src/test.js', await loadConfig('./src/test.js'));
  console.log('./src/test.mjs', await loadConfig('./src/test.mjs'));
  console.log('./src/test.ts', await loadConfig('./src/test.ts'));
  console.log('./src/test.xlsx', await loadConfig('./src/test.xlsx'));
}
bootstrap();
