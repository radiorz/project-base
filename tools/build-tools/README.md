# build

用于打包简单的js项目

## 使用 cli
一般使用命令行进行
```powershell
npx @tikkhun/build
```

## 使用代码
```typescript
import { Build } from '../lib';
const build = new Build({
  outDir: 'test-dist',
  obfuscate: true,
});
build.start();

```
