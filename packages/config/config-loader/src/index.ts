import { loadConfig } from '../lib';
import { saveConfig } from '../lib/save-config';

async function bootstrap() {
  console.log('package.json', await loadConfig('package.json'));
  console.log('./src/.env', await loadConfig('./src/.env'));
  console.log('./src/.env', await loadConfig('./src/.env', { delimiter: '_' })); // 带参数
  console.log('./src/test.xml', await loadConfig('./src/test.xml'));
  console.log('./src/test.toml', await loadConfig('./src/test.toml'));
  console.log('./src/test.js', await loadConfig('./src/test.js'));
  console.log('./src/test.mjs', await loadConfig('./src/test.mjs'));
  console.log('./src/test.ts', await loadConfig('./src/test.ts'));
  console.log('./src/test.xlsx', await loadConfig('./src/test.xlsx'));
  // console.log(
  //   'https://github.com/zhangfisher/flex-tools/blob/master/package.json',
  //   await loadConfig('https://github.com/zhangfisher/flex-tools/blob/master/package.json'),
  // );
}
bootstrap();
async function bootstrapSaver() {
  const config = { test: 123, a: { b: '123', c: '456' } };
  await saveConfig(config, './src/test_saver.json');
  await saveConfig(config, './src/.env.saver');
  await saveConfig(config, './src/test_saver.xml');
  await saveConfig(config, './src/test_saver.toml');
  await saveConfig(config, './src/test_saver.yaml');
  await saveConfig(config, './src/test_saver.js');
  await saveConfig(config, './src/test_saver.xlsx');
}
bootstrapSaver();
