import { defineConfig } from "vite";
import { builtinModules } from "node:module";
const globals = {"Buffer": "Buffer"};
for (const module of builtinModules) {
  globals[`node:${module}`] = module;
}
export default defineConfig({
  build: {
    lib: {
      entry: "./lib/main.ts",
      name: "Utils",
      fileName: "utils",
    },
    // 忽略 nodejs
    rollupOptions: {
      external: [...builtinModules, /^node:/, "Buffer"],
      output: {
        globals,
        inlineDynamicImports: true,
      },
    },
  },
});
