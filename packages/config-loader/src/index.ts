import { readConfig } from '../lib';

async function bootstrap() {
  console.log(readConfig('package.json'));
  console.log(readConfig('.env'));
  console.log('test.js', await readConfig('test.js'));
  console.log('test.js', await readConfig('test.mjs'));
  console.log(await readConfig('test.ts'));
}
bootstrap();
