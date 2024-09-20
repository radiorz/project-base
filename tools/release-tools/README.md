# release

实现项目的简单打包，最终发到 本地的release 中

# 做了什么

其实就是干了三件事 收集文件，打包，项目信息保存(目前是直接将版本)
也可以归纳为将相关文件打包,保存版本等信息，保存到指定文件夹

## 目前的方式

- 使用 archive 的 glob 进行文件收集并压缩
- 项目信息包括版本，打包时间，项目名称等等,目前是直接保存到压缩文件名中
- 是用archive 放入release文件夹中

## 安装

```
npm install @tikkhun/release
```

## 使用

```
tikkhun-release
```

## 参数详见命令行工具

```
tikkhun-release --help
```
