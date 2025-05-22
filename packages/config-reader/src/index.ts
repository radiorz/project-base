import { readConfig } from '../lib';

async function bootstrap() {
  console.log(readConfig('package.json'));
  console.log(readConfig('.env'));
  console.log('test.js', await readConfig('D:/code/project-base/packages/config-reader/test.js'));
  // console.log(readConfig('tsup.config.ts'));
}
bootstrap();
