# config

一个简单的配置管理工具
使用 @tikkhun/config-core 作为配置核心
使用 localStorage 进行持久化存储

## 使用

```javascript
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
```
