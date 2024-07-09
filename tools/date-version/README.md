# Date-version

其实就是一个简单的日期版本号。
可以更新 package.json等 的 version

## 需求分析

- 获取版本号
  - 时间 -format
  - 运行时 编译等环节的版本号
  - 自输入版本名称
- 写入版本号
  - json、普通txt等的读取与写入

## 安装

```powershell
npm install @tikkhun/date-version -D

```

## 使用

```powershell
date-version get

date-version update
```
