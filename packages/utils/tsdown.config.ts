import { defineConfig } from 'tsdown';
import packageJson from './package.json';
const name = packageJson.name;
const version = packageJson.version;
import banner2 from 'rollup-plugin-banner2';
// import { esbuildPluginImport } from '@linjiajian999/esbuild-plugin-import';
// import pluginLodashImport from 'esbuild-plugin-lodash';
export default defineConfig((options) => ({
  plugins: [
    banner2(() => {
      return `/**
  ${name}
  ${version}
*/`;
    }),
  ],
  // 入口文件
  // 不直接指定index 是为了支持直接使用某个文件
  entry: [`lib/**/*.ts`, '!**/*.test.ts'],
  // 格式化
  format: ['esm', 'cjs'],
  // typescript 注释
  dts: true,
  // 拆分
  splitting: false,
  // sourcemap: true,
  clean: true,
  treeshake: true,
  // 压缩代码
  minify: !options.watch,
  // esbuildPlugins: [pluginLodashImport() as any],
}));
