import { defineConfig } from 'tsdown';
export default defineConfig((options) => ({
  // 入口文件
  // 不直接指定index 是为了支持直接使用某个文件
  entry: [`lib/index.ts`, '!**/*.test.ts'],
  // 格式化
  format: ['esm', 'cjs'],
  // 类型声明改由 tsc 单独生成, 这里关闭内置 dts 以绕过 rolldown dts 插件问题
  dts: false,
  // 拆分
  splitting: false,
  // sourcemap: true,
  clean: true,
  treeshake: true,
  // 压缩代码
  minify: !options.watch,
}));
