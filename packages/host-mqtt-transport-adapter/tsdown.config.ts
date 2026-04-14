import { defineConfig } from 'tsdown';
import packageJson from './package.json';
export default defineConfig((options: any) => ({
  entry: ['lib/**/*.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  clean: true,
  treeshake: true,
  minify: !options.watch,
}));
