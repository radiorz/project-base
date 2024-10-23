# create-tools

项目创建工具: 一个统一使用模板生成初始化项目的工具

项目创建最重要的其实就是下载， 复制。 由于模板跟随npm发布，所以下载也省了
其次就是模板编译，其实就是提供了一些变量给用户来自定义，比如文件名，项目名称等等。

## 实现思路
### 复制
使用fs-extra的批量复制进行复制
### 模板编译
采用了 ejs 作为模板引擎，仅当文件名末尾加上 .ejs才进行模板编译

## 安装

```bash
yarn global add @tikkhun/create
```

## 使用

```bash
tikkhun-create --template '../template' --projectName <你项目的名称>
```

## 选项

```bash
tikkhun-create --help
```
