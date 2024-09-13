# config

config 其实就是将分布式的配置源合并起来, 最终将他转化成集中式管理的一个配置文件.

并且实现get set reset remove 的api操作.

## source 配置源

实现 load 方法让 config 可以从source处加载到配置对象.

### EnvSource

经常使用.env进行配置，但经常需要转换成对象使用
默认分隔符为\_\_ 一般不会冲突

## store 存储器

存储所有加载的配置
并且可以获取这些配置
默认使用memorystore.
你可以编写自己的store

## 使用

详见example

```javascript
import { DEFAULT_ENV_MANAGER } from '@tikkhun/config';
console.log(`env`, DEFAULT_ENV_MANAGER.get()); // 获取全部
console.log(`env`, DEFAULT_ENV_MANAGER.get({ path: 'c.c.c' })); // 支持 path形式获取
```
