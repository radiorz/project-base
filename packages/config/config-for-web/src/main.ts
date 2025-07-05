import { DEFAULT_CONFIG_MANAGER } from "../lib/instance";
globalThis.DEFAULT_CONFIG_MANAGER = DEFAULT_CONFIG_MANAGER;
DEFAULT_CONFIG_MANAGER.set({
  path: "config",
  data: { test: "哈哈哈哈" },
});

const result = DEFAULT_CONFIG_MANAGER.get({
  path: "config.test",
});
console.log(`result`, result);
console.log(`DEFAULT_CONFIG_MANAGER`, DEFAULT_CONFIG_MANAGER);
