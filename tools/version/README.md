# version-manager

其实就是一个简单的版本控制器。

- 可以生成版本，和保存版本

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

## 安装

```powershell
npm install @tikkhun/version -D

```

## 使用

```powershell
# 单纯获取
date-version get 
# 更新package.json的版本
date-version update
# 
node-version save
```
