import { delimiter } from 'path';
import { loadConfig } from '../lib';

async function bootstrap() {
  console.log(loadConfig('package.json'));
  console.log(loadConfig('.env'));
  console.log(loadConfig('.env', { delimiter: '_' }));
  console.log('test.js', await loadConfig('test.js'));
  console.log('test.js', await loadConfig('test.mjs'));
  console.log(await loadConfig('test.ts'));
}
bootstrap();
