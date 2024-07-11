# build

用于打包简单的js项目

## 使用 cli

一般使用命令行进行

```powershell
npx @tikkhun/build --help
```

## 使用代码

详细见代码中的src.

```typescript
import { Build } from '@tikkhun/build';
const build = new Build({
  outDir: 'test-dist',
  obfuscate: true,
});
build.start();
```
