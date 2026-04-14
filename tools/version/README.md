# version-manager

其实就是一个简单的版本控制器。

- 可以生成版本
- 可以读取版本
- 可以写入版本
- 可以批量更新多个目标文件

## 需求分析

- 生成/获取版本号
  - 时间
    - format
  - 运行时 编译等环节的版本号
    - node version
    - bytenode version
  - 自输入版本名称
    - 自己输入
- 写入版本号
  - json、普通txt等的读取与写入

## 当前能力

- `getter`: 负责生成新的版本值
- `store.get()`: 负责读取目标文件中的当前版本
- `store.set(value)`: 负责把指定版本写入目标文件
- `store.update(value)`: 负责执行一次更新语义的写入
- `VersionManager.read()`: 批量读取所有目标
- `VersionManager.set(value)`: 批量写入指定版本
- `VersionManager.update()`: 先通过 getter 生成版本, 再批量写入

## 已支持的目标类型

- `json`
- `yaml`
- `toml`
- `xml`
- `env`
- `text.raw`
- `text.replace`

结构化文件的读写优先复用 `@tikkhun/config-loader`, 文本文件由 `TextStore` 处理.

## 安装

```powershell
pnpm add @tikkhun/version -D

```

## 使用

```powershell
# 单纯生成日期版本
date-version get 
# 使用配置文件读取当前版本值
semantic-version read --config version.json --value-only
# 使用配置文件执行 patch 更新
semantic-version update --config version.json --position patch
# 读取 package.json 的版本
date-version read --file package.json --type json --key version
# 把日期版本更新到 package.json 的 version 字段
date-version update
# 把指定值写入 package.json 的 version 字段
date-version set 2026.04.13 --file package.json --type json --key version
# 读取 .node-version
node-version read
# 生成并写入当前 node 版本
node-version save
# 读取 package.json 当前版本
semantic-version read --file package.json --type json --key version
# 把 patch +1 后写回 package.json
semantic-version update --position patch
```

## 配置文件驱动

如果一个项目有多个版本落点, 更推荐直接使用 `version.json`, 而不是额外写脚本。

例如:

```json
{
  "getter": {
    "type": "semantic",
    "file": "./package.json",
    "key": "version",
    "position": "patch"
  },
  "currentTargetIndex": 0,
  "targets": [
    {
      "type": "json",
      "file": "./package.json",
      "path": "version"
    },
    {
      "type": "text",
      "file": "./wp-link-dispatcher.php",
      "mode": "replace",
      "pattern": "Version:\\s*(\\d+\\.\\d+\\.\\d+)",
      "replacement": "Version: {{version}}"
    }
  ]
}
```

对应命令:

```powershell
semantic-version read --config version.json --value-only
semantic-version update --config version.json --position patch
semantic-version update --config version.json --position minor
semantic-version update --config version.json --position major
```

## 代码示例

```ts
import { SemanticVersionGetter, VersionManager } from '@tikkhun/version';

async function bootstrap() {
  const manager = new VersionManager({
    getter: new SemanticVersionGetter({
      file: 'package.json',
      key: 'version',
    }),
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

  const readResult = await manager.read();
  const updateResult = await manager.update();

  console.log(readResult);
  console.log(updateResult);
}

bootstrap();
```

## WordPress 插件示例

如果一个插件需要同时更新:

- `package.json` 的 `version`
- 主插件文件头部的 `Version:`
- 主插件文件里的 `WLD_VERSION`
- `README.txt` 里的 `Stable tag`

可以直接声明多个 target:

```ts
import { Positions, SemanticVersionGetter, VersionManager } from '@tikkhun/version';

async function bootstrap() {
  const manager = new VersionManager({
    getter: new SemanticVersionGetter({
      file: 'package.json',
      key: 'version',
      position: Positions.patch,
    }),
    targets: [
      {
        type: 'json',
        file: 'package.json',
        path: 'version',
      },
      {
        type: 'text',
        file: 'wp-link-dispatcher.php',
        mode: 'replace',
        pattern: 'Version:\\s*(\\d+\\.\\d+\\.\\d+)',
        replacement: 'Version: {{version}}',
      },
      {
        type: 'text',
        file: 'wp-link-dispatcher.php',
        mode: 'replace',
        pattern: "define\\('WLD_VERSION',\\s*'([^']+)'\\);",
        replacement: "define('WLD_VERSION', '{{version}}');",
      },
      {
        type: 'text',
        file: 'README.txt',
        mode: 'replace',
        pattern: 'Stable tag:\\s*(\\d+\\.\\d+\\.\\d+)',
        replacement: 'Stable tag: {{version}}',
      },
    ],
  });

  await manager.update();
}

bootstrap();
```
