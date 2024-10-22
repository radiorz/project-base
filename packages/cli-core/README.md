# cli-core

用于创建cli的简便工具

## 使用 cli-core 配置自己的 cli 工具

```javascript
import { Command } from '../lib';
const cli = new Command({
  // 版本
  version: '1.1.1',
  // 描述
  description: 'hahaha',
  // 默认选项
  defaultOptions: {
    n: 1,
    s: '123',
    b: true,
    o: {
      n: 1,
      s: '123',
      b: true,
    },
  },
  // 排除选项
  excludeOptions: ['o.b'],
  // 选项类型
  optionTypes: {
    n: 'number',
    s: 'string',
    b: 'boolean',
    o: {
      n: 'number',
      s: 'string',
      b: 'boolean',
    },
  },
  // 选项标题
  optionTitles: {
    n: 'numbertitle',
    s: 'stringtitle',
    b: 'booleantitle',
    o: {
      n: 'numbertitleooo',
      s: 'stringtitleooo',
      b: 'booleantitleooo',
    },
  },
});
// 开始运行
cli.start((option) => {
  // 取出选项并执行相应逻辑
  console.log(`option`, option);
});
```

## 不同形式

获取参数的形式有多种形式

- 命令行传参（args）
- 问答式（prompts）
- 配置文件（config）
  你可以通过new Cli的 option 中的types 去决定是否启用这种功能形式

### 命令行传参形式
```bash
xxx-cli  --help # 可查看全部命令行参数
```
### 问答式
```bash
xxx-cli prompts # 即可进入问答列表
```
### 外部配置文件
```bash
xxx-cli config -c xxx.config.json # 将  xxx.config.json 作为配置文件将配置导入
```
