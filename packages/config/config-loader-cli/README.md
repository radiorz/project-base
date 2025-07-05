# config-loader-cli

用于支持读取和写入配置文件的命令行工具。

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
- .xlsx

## 安装

```bash
pnpm i @tikkhun/config-loader-cli
```

## 使用
```bash
# 读取配置文件
tikkhun-config-loader --input=./config.json
```

```bash
# 写入配置文件
tikkhun-config-loader --input=./config.json --output=./config.js
```
