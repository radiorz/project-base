import { defineConfig } from 'tsdown';
import packageJson from './package.json';
export default defineConfig((options: any) => ({
  // 入口文件
  // 不直接指定index 是为了支持直接使用某个文件
  entry: [`lib/**/*.ts`, '!**/*.test.ts'],
  // 格式化
  format: ['esm', 'cjs'],
  // 拆分
  splitting: false,
  // sourcemap: true,
  clean: true,
  treeshake: true,
  // 压缩代码
  minify: !options.watch,
  // typescript 注释
  dts: true,
}));
