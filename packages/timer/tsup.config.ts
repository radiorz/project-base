import { defineConfig } from 'tsup';
import packageJson from './package.json';
import { capitalize } from '@tikkhun/utils-core';
const name = packageJson.name.split('/')[1];
export default defineConfig((options) => ({
  // 入口文件
  // 不直接指定index 是为了支持直接使用某个文件
  entry: ['lib/**/*.ts'],
  // 格式化
  format: ['cjs', 'esm'],
  // typescript 注释
  dts: true,
  // 拆分
  splitting: false,
  // sourcemap: true,
  clean: true,
  treeshake: true,
  globalName: capitalize(name),
  compileOptions: {
    global_defs: {
      crypto: 'crypto',
    },
  },
  'built-ins': ['crypto'],
  external: ['crypto'],
  // 压缩代码
  minify: !options.watch,
  banner: {
    js: `/**
  @tikkhun/time-manager
*/`,
  },
}));
