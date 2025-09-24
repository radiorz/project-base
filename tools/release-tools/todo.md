# TODO
- 压缩速度: 优化 archive 速度 7zip 或者微软自带的快很多。
- fix directory rename需要重新glob。
- file 支持glob
- 支持directory
- 支持数组传参，也就是压缩多次

# DONE
## 20250919 星期五
- config文件之后还能用args配置（目前是arg 也支持config文件）
## 20250522 星期四
- 配置文件读取： 支持 js ts json 等多种文件形式的读取 yaml?

## 20241023 星期三
- infoOptions input 可增加字段
## 20241022 星期二
- plugin化 各种特色打包都通过插件实现
- release path 根据 cwd 而不是 workspace 定位
- 文件可重命名 renamePlugin
## 20241021 星期一

- infoStore 可以存储在 xml json 等多种形式
- read info from xml(未与业务相结合)

## 20240921 星期六

- 项目信息可存入文件而不是文件名(类似android升级包的做法，android升级包)

- onProgress 显示进度条。

## 20240920 星期五

- 独立项目信息这个模块，便于拓展。

# FUTURE
