import { Build } from '../lib';
const build = new Build({
  outDir: 'test-dist',
  obfuscate: true,
});
build.start();
