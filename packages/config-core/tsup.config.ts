import { defineConfig } from 'tsup';
import packageJson from './package.json';
const { name, version } = packageJson;
export default defineConfig({
  entry: ['lib/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  // sourcemap: true,
  clean: true,
  treeshake: true,
  banner: {
    js: `/**
  ${name}
  ${version}
*/`,
  },
});
