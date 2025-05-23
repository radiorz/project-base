# config-reader

用于支持读取配置文件的工具包

## 支持

目前支持文件类型

- .json
- .js
- .yaml
- .yml
- .toml
- .env
- .ts

## 使用

```bash
pnpm i config-reader
```

```ts
import { readConfig } from 'config-reader';
const config = await readConfig('./config.json'); // 这里你只要输入不同配置文件的路径即可
// console.log(readConfig('package.json'));
// console.log(readConfig('.env'));
// console.log('test.js', await readConfig('test.js'));
// console.log('test.js', await readConfig('test.mjs'));
// console.log(await readConfig('test.ts'));

console.log(config);
```
