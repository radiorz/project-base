import { defineConfig } from 'tsdown';

export default defineConfig((options: any) => ({
  entry: [`lib/**/*.ts`, '!**/*.test.ts'],
  format: ['esm', 'cjs'] as any,
  dts: false,
  splitting: false,
  clean: true,
  treeshake: true,
  minify: false,
}));
