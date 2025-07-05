import { defineConfig } from 'tsup';
import packageJson from './package.json';
const { name, version } = packageJson;
console.log(JSON.stringify({ name, version }));
export default defineConfig({
  entry: ['lib/index.ts', '!**/*.test.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  banner: {
    js: `/**
  ${name}
  ${version}
*/`,
  },
});
