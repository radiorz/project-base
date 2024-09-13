import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import banner from 'rollup-plugin-banner';

// import packageJson from './package.json' 'j
export default {
  input: 'lib/index.ts',
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
    typescript(),
    terser({
      // 压缩代码，等同于 tsup 的 minify 选项
      format: {
        comments: function (node, comment) {
          return comment.value.includes('name');
        },
      },
    }),
    banner('hahah'),
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
