import { defineConfig } from 'tsup';
import pkg from './package.json';
const { name, version } = pkg;
export default defineConfig((options) => ({
  // 入口文件
  // 不直接指定index 是为了支持直接使用某个文件
  entry: ['cli/**/*.ts', '!**/*.test.ts'],
  // 格式化
  format: ['cjs', 'esm'],
  // typescript 注释
  dts: true,
  // 拆分
  splitting: false,
  // sourcemap: true,
  clean: true,
  treeshake: true,
  // 压缩代码
  minify: !options.watch,
  banner: {
    js: `/**
  ${name}
  ${version}
*/`,
  },
}));
