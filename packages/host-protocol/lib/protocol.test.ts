import { describe, it, expect } from 'vitest';
import { createHostProtocol } from './protocol';

describe('host-protocol', () => {
  it('topic.to 应该生成去中心化入站 topic', () => {
    const protocol = createHostProtocol({ rootTopic: 'host' });
    expect(protocol.topic.to('device-1', 'config.get')).toBe('host/device-1/config.get');
  });

  it('topic.broadcast 应该生成 broadcast topic', () => {
    const protocol = createHostProtocol({ rootTopic: 'host' });
    expect(protocol.topic.broadcast('register')).toBe('host/broadcast/register');
    expect(protocol.topic.broadcastAll()).toBe('host/broadcast/#');
  });

  it('parseToId 和 parseType 应该能解析 topic', () => {
    const protocol = createHostProtocol({ rootTopic: 'host' });
    expect(protocol.topic.parseToId('host/device-1/control.invoke')).toBe('device-1');
    expect(protocol.topic.parseType('host/device-1/control.invoke')).toBe('control.invoke');
  });
});

