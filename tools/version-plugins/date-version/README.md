# date-version

## 使用

```javascript
import { getDateVersion } from '@tikkhun/date-version';

console.log(getDateVersion());
console.log(getDateVersion({ pattern: 'YYYY.MM.DD' }));
```

## 和 version 配合使用

这个包只负责"生成日期版本值", 不负责读写文件.

如果要把日期版本写入 `package.json`、`.env`、`src/version.ts` 等文件, 应该配合 `@tikkhun/version` 使用:

```ts
import { VersionManager } from '@tikkhun/version';
import { getDateVersion } from '@tikkhun/date-version';

async function bootstrap() {
  const manager = new VersionManager({
    getter: {
      get() {
        return getDateVersion({ pattern: 'YYYY.MM.DD' });
      },
    },
    targets: [
      {
        type: 'json',
        file: 'package.json',
        path: 'version',
      },
      {
        type: 'text',
        file: 'src/version.ts',
        mode: 'replace',
        pattern: "version\\s*=\\s*['\\\"]([^'\\\"]+)['\\\"]",
        replacement: "version = '{{version}}'",
      },
    ],
  });

  await manager.update();
}

```
