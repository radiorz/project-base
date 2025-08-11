# pnpm 使用

## 什么是 pnpm workspace

pnpm workspace 是 pnpm 提供的一个功能，允许你在一个仓库中管理多个相互依赖的包（package）。通过 workspace，你可以：
- 在一个仓库中开发多个相关的包
- 包之间的依赖可以直接通过本地路径引用
- 一次性安装所有包的依赖
- 统一构建、测试和发布所有包

## 如何设置 pnpm workspace

### 1. 初始化项目

首先，创建一个新的项目文件夹并初始化：

```bash
mkdir project-base
cd project-base
pnpm init
```

### 2. 创建 workspace 配置文件

在项目根目录下创建 `pnpm-workspace.yaml` 文件，用于定义 workspace 的范围：

```yaml
# pnpm-workspace.yaml
packages:
  # 所有在 packages 目录下的子文件夹
  - 'packages/*'
  # 所有在 tools 目录下的子文件夹
  - 'tools/*'
  # 排除特定目录
  - '!packages/exclude-me'
```

### 3. 创建包结构

按照配置文件中定义的模式，创建相应的包结构：

```bash
# 创建包目录
mkdir -p packages/foo packages/bar tools/baz

# 初始化各个包
cd packages/foo && pnpm init && cd ../..
cd packages/bar && pnpm init && cd ../..
cd tools/baz && pnpm init && cd ../..
```

## workspace 中的依赖管理

### 安装依赖

- 安装到根目录（通常是开发依赖）：
  ```bash
  pnpm add -w typescript -D
  ```

- 安装到特定包：
  ```bash
  pnpm add react --filter foo
  ```

- 安装本地包作为依赖：
  ```bash
  # 在 bar 包中依赖 foo 包
  pnpm add foo --filter bar
  ```

### 更新依赖

- 更新所有包的依赖：
  ```bash
  pnpm update -w
  ```

- 更新特定包的依赖：
  ```bash
  pnpm update --filter foo
  ```

## 运行脚本

- 在根目录运行脚本：
  ```bash
  pnpm run build
  ```

- 在特定包中运行脚本：
  ```bash
  pnpm run build --filter foo
  ```

- 在所有包中运行脚本：
  ```bash
  pnpm run build --filter "./packages/**"
  ```

## 常见问题

### 1. 如何查看 workspace 中的所有包？

```bash
pnpm ls -r
```

### 2. 如何清理所有 node_modules 文件夹？

```bash
pnpm store prune
```

### 3. 如何发布所有包？

```bash
pnpm publish -r
```

## 项目结构示例

一个典型的 pnpm workspace 项目结构如下：

```
project-base/
├── packages/
│   ├── foo/
│   │   ├── package.json
│   │   └── src/
│   └── bar/
│       ├── package.json
│       └── src/
├── tools/
│   └── baz/
│       ├── package.json
│       └── src/
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

## 总结

pnpm workspace 是管理多包项目的强大工具，它可以帮助你：
1. 简化多包项目的依赖管理
2. 提高开发效率
3. 减少磁盘空间占用
4. 统一项目流程

通过合理配置和使用 pnpm workspace，可以让你的多包项目开发更加顺畅。
