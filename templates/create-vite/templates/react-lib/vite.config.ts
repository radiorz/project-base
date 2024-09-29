import { defineConfig } from 'vite';
import packageJson from './package.json';
import react from '@vitejs/plugin-react-swc';
import banner from 'vite-plugin-banner';
import { fileURLToPath, URL } from 'node:url';
const name = packageJson.name.split('/')[1];
import { toBigCamelCase } from '@tikkhun/utils-core';
export default defineConfig({
  plugins: [
    react(),
    banner(`
    packageName: ${packageJson.name} 
    version: ${packageJson.version}
    `),
  ],
  build: {
    lib: {
      entry: './lib/index.ts',
      name: toBigCamelCase(name),
      fileName: name,
    },
    rollupOptions: {
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          ol: 'ol',
          rlayers: 'rlayers',
        },
      },
      external: ['react', 'react-dom', 'ol', 'rlayers'],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./lib', import.meta.url)),
    },
  },
});
