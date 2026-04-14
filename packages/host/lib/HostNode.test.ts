import { describe, it, expect } from 'vitest';
import { HostNode } from './HostNode';

describe('HostNode', () => {
  it('应该能处理 control.invoke 并回发 control.result', async () => {
    /**
     * published 发布记录列表.
     * 设计原因: 用数组收集 publish 行为,便于断言 topic 与 message 是否符合预期.
     */
    const published: Array<{ topic: string; message: any }> = [];

    /**
     * inboxHandler inbox 订阅回调.
     * 设计原因: 用变量捕获 subscribe 注册的 handler,从而在测试中模拟入站消息.
     */
    let inboxHandler: ((topic: string, message: any) => void) | null = null;

    const adapter = {
      /**
       * @param topic 目标 topic.
       * @param message 消息体.
       * 设计原因: 仅记录参数,不做真实传输,让测试不依赖外部中间件.
       */
      publish(topic: string, message: any) {
        published.push({ topic, message });
      },
      /**
       * @param topic 订阅 topic.
       * @param handler 订阅回调.
       * @returns 取消订阅函数.
       * 设计原因: 只在匹配 inbox topic 时保存 handler,避免测试场景里引入无关订阅.
       */
      subscribe(topic: string, handler: (topic: string, message: any) => void) {
        if (topic === 'host/host-1/#') inboxHandler = handler;
        return () => {};
      },
    };

    const node = new HostNode({ id: 'host-1', name: 'demo', adapter, managerEnabled: false });
    node.host.registerCapability({
      name: 'system',
      methods: {
        /**
         * ping 探活方法.
         * 设计原因: 用最小可预测返回值验证 invoke 到 result 的整条链路.
         */
        ping() {
          return 'pong';
        },
      },
    });

    node.start();

    expect(published.some((p) => p.topic === 'host/broadcast/register')).toBe(true);

    inboxHandler?.('host/host-1/control.invoke', {
      type: 'control.invoke',
      ts: Date.now(),
      from: 'peer-1',
      to: 'host-1',
      payload: { capability: 'system', method: 'ping', args: [] },
    });

    await new Promise((r) => setTimeout(r, 0));

    const result = published.find((p) => p.topic === 'host/peer-1/control.result');
    expect(result?.message?.type).toBe('control.result');
    expect(result?.message?.payload?.ok).toBe(true);
    expect(result?.message?.payload?.result).toBe('pong');
  });
});
