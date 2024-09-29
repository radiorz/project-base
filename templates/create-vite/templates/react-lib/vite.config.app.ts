import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { toBigCamelCase } from '@tikkhun/utils-core';
import packageJson from './package.json';
import { fileURLToPath, URL } from 'node:url';

const name = packageJson.name.split('/')[1];
export default defineConfig({
  server: {
    host: '0.0.0.0',
  },
  plugins: [react()],
  build: {
    lib: {
      entry: './lib/index.ts',
      name: toBigCamelCase(name),
      fileName: name,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-router', 'react-router-dom'],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./lib', import.meta.url)),
    },
  },
});
