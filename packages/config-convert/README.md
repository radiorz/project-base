# config-loader

用于支持读取配置文件的工具包

## 功能

目前支持文件类型

- .json
- .js
- .ts
- .yaml
- .yml
- .toml
- .xml
- .env

## 使用

```bash
pnpm i @tikkhun/config-loader
```

```ts
import { loadConfig } from '@tikkhun/config-loader';
const config = await loadConfig('./config.json'); // 这里你只要输入不同配置文件的路径即可
// 允许load多种配置文件
// console.log(loadConfig('package.json'));
// console.log(loadConfig('.env'));
// console.log('test.js', await loadConfig('test.js'));
// console.log('test.js', await loadConfig('test.mjs'));
// console.log(await loadConfig('test.ts'));

console.log(config);
```
