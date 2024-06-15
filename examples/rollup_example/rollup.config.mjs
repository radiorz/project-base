// rollup.config.mjs
import terser from '@rollup/plugin-terser';
const name = 'bundle';
export default {
  input: 'src/main.js',
  output: [
    {
      file: `dist/${name}.js`,
      format: 'cjs',
    },
    {
      file: `dist/${name}.min.js`,
      format: 'iife',
      name: 'version',
      plugins: [terser()],
    },
  ],
};
