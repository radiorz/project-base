# env-config

经常使用.env进行配置，但经常需要转换成对象使用

所以写个小包转化
默认分隔符为\_\_ 一般不会冲突

## 使用

详见example

```javascript
import { DEFAULT_ENV_MANAGER } from "@tikkhun/env-config";
console.log(`env`, DEFAULT_ENV_MANAGER.get()); // 获取全部
console.log(`env`, DEFAULT_ENV_MANAGER.get({ path: "c.c.c" })); // 支持 path形式获取
```
