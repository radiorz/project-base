import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import packageJson from './package.json';

export default {
  input: 'lib/**/*.ts',
  output: [
    {
      dir: 'dist',
      format: 'cjs',
      entryFileNames: '[name].cjs.js',
      chunkFileNames: '[name].cjs.js',
      sourcemap: true,
    },
    {
      dir: 'dist',
      format: 'esm',
      entryFileNames: '[name].esm.js',
      chunkFileNames: '[name].esm.js',
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json', // 确保你的 tsconfig.json 配置正确
      declaration: true, // 生成 .d.ts 文件
      exclude: ['**/*.test.ts'],
    }),
    terser({
      // 压缩代码，等同于 tsup 的 minify 选项
      format: {
        comments: function (node, comment) {
          return comment.value.includes('name');
        },
      },
    }),
  ],
  external: ['fs', 'path'], // 根据需要列出外部依赖
  watch: {
    include: 'lib/**',
  },
  treeshake: true, // 启用摇树优化
  onwarn: function (warning, warn) {
    // 处理警告信息，类似于 tsup 的 clean 选项
    if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
    warn(warning);
  },
};
