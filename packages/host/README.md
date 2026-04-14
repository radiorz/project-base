# host

## 使用

> 目标: 提供一套最小抽象,让你用 publish/subscribe transport 驱动 host 的能力注册,配置读写,远程调用,以及可选的设备发现.

## 安装

```bash
pnpm add @tikkhun/host
```

## 核心概念

- Host: 业务内核. 注册能力,配置读写与持久化,生成设备树,统一 invoke 入口
- HostNode: 运行时节点. 把 Host 和 transport 以及 protocol 编排起来,负责订阅 inbox 并处理协议消息
- HostManager: 可选管理能力. 监听 broadcast 与 inbox,发现远端 host,并把消息转成事件
- ShadowHost: 远端主机代理. 封装 topic 拼装与消息发送,对上层提供 requestConfigGet,invoke 等便捷方法
- TransportAdapter: 你提供的消息 IO 适配器. 只要实现 publish 与 subscribe 就能跑
- StorageAdapter: 你提供的存储适配器. 用于 Host 配置持久化. 默认 MemoryStorage
- HostHostTree: 标准设备树结构. 管理端用它渲染能力与方法列表

### 为什么有了 Host 还要 HostNode

- 职责拆分: Host 只关心业务内核,例如注册能力,配置读写,方法调用. 它不关心消息传输和协议细节. HostNode 则负责把 Host 与 TransportAdapter 和 Protocol 编排在一起,提供 start/stop 生命周期与消息路由入口. 这样 Host 可以在不同传输层复用,保持稳定.
- 生命周期管理: Host 没有订阅与广播的概念. HostNode 负责订阅 inbox,发布 register 广播,并在 stop 时统一释放订阅,避免资源泄漏.
- 协议适配: HostNode 处理 config.get,config.set,control.invoke,relay 等协议消息,把消息转换为对 Host 的 getConfig,setConfig,invoke 等调用,形成清晰的边界.
- 可选管理能力: HostNode 可按需打开 managerEnabled,内嵌 HostManager 用于发现其他主机与事件分发. Host 不包含这些可选能力,避免膨胀.

### 父子从属关系

```
HostNode
  ├─ host: Host
  │    └─ storage: StorageAdapter
  ├─ adapter: TransportAdapter
  ├─ protocol + codec
  └─ manager?: HostManager
         ├─ hosts: Map<string, ShadowHost>
         └─ bus: Eventbus
```

- HostNode 拥有 Host 并驱动它对外工作. Host 专注业务方法与配置,不直接触达消息通道.
- HostNode 依赖 TransportAdapter 与 Protocol 完成订阅和发布. codec 可选用于编解码与校验.
- HostManager 挂在 HostNode 之下且可选. 它监听 broadcast 与 inbox,发现远端主机后维护 ShadowHost 缓存表.
- ShadowHost 由 HostManager 管理与复用,对单个远端 Host 提供简化的发送接口,封装 topic 与 from,to 字段补齐.
- StorageAdapter 仅被 Host 使用,用于配置持久化与加载,与传输无关.

### 消息流简图

1. HostNode.start 订阅 inbox,可选启动 HostManager.watch,随后通过 broadcast 发送 register.
2. HostManager 收到 register 后创建或更新对应的 ShadowHost,并在内部 Eventbus 上发出 host.registered 事件.
3. 管理端通过 ShadowHost 发送 config.get,config.set,control.invoke 或 relay 消息到目标主机.
4. 目标端 HostNode.handleIncoming 解码并分发到 handleConfigGet,handleConfigSet,handleControlInvoke 或 handleRelay,随后调用 Host 对应能力或配置接口,并发布 result.

### 源码位置速查

- Host 实现: [Host.ts](file:///d:/workcode-my/project-base/packages/host/lib/Host.ts)
- HostNode 实现: [HostNode.ts](file:///d:/workcode-my/project-base/packages/host/lib/HostNode.ts)
- HostManager 实现: [HostManager.ts](file:///d:/workcode-my/project-base/packages/host/lib/HostManager.ts)
- ShadowHost 实现: [ShadowHost.ts](file:///d:/workcode-my/project-base/packages/host/lib/ShadowHost.ts)
- Transport 接口: [transport.ts](file:///d:/workcode-my/project-base/packages/host/lib/transport.ts)
- Storage 接口与内存实现: [storage.ts](file:///d:/workcode-my/project-base/packages/host/lib/storage.ts)

## TransportAdapter 例子

```ts
import type { TransportAdapter, Unsubscribe } from 'host';

export function createMemoryTransport(): TransportAdapter & {
  emit: (topic: string, message: any) => void;
} {
  const handlers = new Map<string, Set<(topic: string, message: any) => void>>();

  const match = (pattern: string, topic: string) => {
    if (pattern.endsWith('/#')) return topic.startsWith(pattern.slice(0, -2));
    return pattern === topic;
  };

  const subscribe: TransportAdapter['subscribe'] = (topicPattern, handler): Unsubscribe => {
    const set = handlers.get(topicPattern) ?? new Set();
    set.add(handler);
    handlers.set(topicPattern, set);
    return () => {
      const cur = handlers.get(topicPattern);
      if (!cur) return;
      cur.delete(handler);
      if (cur.size === 0) handlers.delete(topicPattern);
    };
  };

  const publish: TransportAdapter['publish'] = (topic, message) => {
    for (const [pattern, set] of handlers) {
      if (!match(pattern, topic)) continue;
      for (const h of set) h(topic, message);
    }
  };

  return {
    publish,
    subscribe,
    emit: (topic, message) => publish(topic, message),
  };
}
```

## Host

### 注册能力与调用

```ts
import { Host } from 'host';

const host = new Host({ id: 'host-1', name: 'demo' });

host.registerCapability({
  name: 'system',
  title: 'system',
  methods: {
    ping() {
      return 'pong';
    },
    async sum(a: number, b: number) {
      return a + b;
    },
  },
});

const tree = host.getHostTree();
const pong = await host.invoke('system', 'ping');
const three = await host.invoke('system', 'sum', 1, 2);
```

### 配置读写与持久化

```ts
import { Host, MemoryStorage } from 'host';

const host = new Host({
  id: 'host-1',
  storage: new MemoryStorage(),
  config: { feature: { enabled: true } },
});

host.setConfig('feature.enabled', false);
const enabled = host.getConfig<boolean>('feature.enabled');

await host.saveConfig();
await host.loadConfig();
```

### 心跳

```ts
import { Host } from 'host';

const host = new Host({ id: 'host-1' });

const stop = host.startHeartbeat({
  intervalMs: 5_000,
  onHeartbeat: (payload) => {
    console.log('heartbeat', payload.id, payload.ts);
  },
  getStatus: () => ({ cpu: 0.12 }),
});

stop();
```

## HostNode 或 HostNode

### 创建并启动

```ts
import { HostNode, type TransportAdapter } from 'host';

const adapter: TransportAdapter = {
  publish(topic, message) {
    console.log('publish', topic, message.type);
  },
  subscribe(topic, handler) {
    console.log('subscribe', topic);
    return () => console.log('unsubscribe', topic);
  },
};

const node = new HostNode({
  id: 'host-1',
  name: 'demo',
  adapter,
  managerEnabled: false,
});

node.host.registerCapability({
  name: 'system',
  methods: {
    ping() {
      return 'pong';
    },
  },
});

node.start();
node.stop();
```

### 使用 HostNode 别名

```ts
import { HostNode, type HostNodeOptions } from 'host';

const options: HostNodeOptions = {
  id: 'host-1',
  adapter: {
    publish() {},
    subscribe() {
      return () => {};
    },
  },
};

const node = new HostNode(options);
node.start();
```

## HostManager

### 监听与发现

```ts
import { HostManager } from 'host';
import { createMemoryTransport } from './transport-memory';

const transport = createMemoryTransport();

const manager = new HostManager({
  id: 'manager-1',
  adapter: transport,
});

manager.watch({ watchBroadcast: true, watchInbox: true });

manager.bus.getNode('manager')?.on('host.registered', (e) => {
  console.log('host.registered', e.hostId);
});

manager.stop();
```

## ShadowHost

### 发送控制与配置请求

```ts
import { ShadowHost } from 'host';
import { createMemoryTransport } from './transport-memory';
import { createHostProtocol } from '@tikkhun/host-protocol';

const transport = createMemoryTransport();
const protocol = createHostProtocol();

const shadow = new ShadowHost({
  hostId: 'host-1',
  fromId: 'manager-1',
  adapter: transport,
  protocol,
});

shadow.requestConfigGet('feature.enabled');
shadow.requestConfigSet('feature.enabled', true);
shadow.invoke('system', 'ping', []);
shadow.relay('host-2', 'custom/topic', { hello: 'world' });
```

## 测试

vitest 默认会进入 watch 模式. 如果想单次运行,用下面这个.

```bash
pnpm -C packages/host exec vitest run
```

```
