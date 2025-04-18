# TODO

- source async init 和 load
- 远程获取，需要解决异步处理（目前代码是基于同步来做的）异步代码只能是load异步，sync异步，而config本身的api最好是同步的（比如set reset摊上异步的source就得是异步了 addSource由于要等load 所以也是异步的）异步的不好就是会污染调用链
- 软同步与硬同步 也就是说每次更新是否都要同步给 source，这个目前是每次都给，由于没有远程获取所以一般不会失败（source掉线没存，下次启动时source依然是旧的）。
- source 变更 config要更新，这个没有做，如果你想做 就监听source更新，重新调用config load就行了 而且这种监听要避免没完没了，也就是我变他变，他变我变就会无限循环
- 配置子模块，
# DONE

## 20240913 星期五

- 使用proxy 完成细粒度更新(不是所有配置的变化) 你可以使用 on('valuechange ')知道什么时候哪个值改变了 这个 onchange没有科里化 也就是我不能onmqtt('change')这种缩小范围的操作，不过可以在callback通过path进行过滤，也就我监听valueChange ，然后path =='mqtt'方可更新
- 重置是各个源实现自己的重置逻辑，目前localstorage是直接清空 因为有env源垫底。
- source 的双向同步，目前应用最多的还是本地source(env,localstorage) 还未涉及远程config


# FUTURE
