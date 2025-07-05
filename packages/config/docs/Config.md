# config

配置一个是 api get set reset 的api wrapper save
另一个是source 也就是源数据
最后一个是 config watch

sources--merge-->initialConfig--watch->configWatcher--wrapApi->config

## source 
- 一种是env  // 前端如果使用vite会偷偷给你设置， 结合 @tikkhun/env-source 初始化
- 一种是 process.env ，// 后端需要env loader 结合 @tikkhun/env-source 初始化
- 一种是localstorage ,  // 前端存储 
- 一种是 文件config-loader // 文件配置 可以使用 @tikkhun/config-loader 这个库读取
