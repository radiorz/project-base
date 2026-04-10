import { describe, it, expect, vi } from 'vitest';
import { EventBus } from './index';

describe('EventBus', () => {
  describe('基础功能', () => {
    it('应该能正常订阅和触发事件', () => {
      const bus = new EventBus();
      const listener = vi.fn();
      
      bus.on('test.event', listener);
      bus.emit('test.event', 'data');
      
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith('data');
    });

    it('应该能取消订阅单个监听器', () => {
      const bus = new EventBus();
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      
      bus.on('test.event', listener1);
      bus.on('test.event', listener2);
      
      bus.off('test.event', listener1);
      bus.emit('test.event', 'data');
      
      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalledTimes(1);
    });

    it('应该能取消订阅事件的所有监听器', () => {
      const bus = new EventBus();
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      
      bus.on('test.event', listener1);
      bus.on('test.event', listener2);
      
      bus.off('test.event');
      bus.emit('test.event', 'data');
      
      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).not.toHaveBeenCalled();
    });

    it('应该支持多个参数', () => {
      const bus = new EventBus();
      const listener = vi.fn();
      
      bus.on('test.event', listener);
      bus.emit('test.event', 'arg1', 2, { key: 'value' });
      
      expect(listener).toHaveBeenCalledWith('arg1', 2, { key: 'value' });
    });
  });

  describe('通配符功能', () => {
    it('应该支持单级通配符 *', () => {
      const bus = new EventBus();
      const listener = vi.fn();
      
      bus.on('user.*', listener);
      bus.emit('user.login', 'Alice');
      bus.emit('user.logout', 'Alice');
      bus.emit('order.created', 'order1');
      
      expect(listener).toHaveBeenCalledTimes(2);
      expect(listener).toHaveBeenCalledWith('Alice');
    });

    it('应该支持多级通配符 **', () => {
      const bus = new EventBus();
      const listener = vi.fn();
      
      bus.on('**', listener);
      bus.emit('user.login', 'Alice');
      bus.emit('user.profile.update', { name: 'Bob' });
      bus.emit('order.created', 'order1');
      
      expect(listener).toHaveBeenCalledTimes(3);
    });

    it('应该支持部分通配符路径', () => {
      const bus = new EventBus();
      const listener = vi.fn();
      
      bus.on('user.**', listener);
      bus.emit('user.login', 'Alice');
      bus.emit('user.profile.update', { name: 'Bob' });
      bus.emit('order.created', 'order1');
      
      expect(listener).toHaveBeenCalledTimes(2);
    });

    it('应该同时匹配多个通配符监听器', () => {
      const bus = new EventBus();
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      const listener3 = vi.fn();
      
      bus.on('user.login', listener1);
      bus.on('user.*', listener2);
      bus.on('**', listener3);
      
      bus.emit('user.login', 'Alice');
      
      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
      expect(listener3).toHaveBeenCalledTimes(1);
    });
  });

  describe('once 功能', () => {
    it('once 监听器应该只触发一次', () => {
      const bus = new EventBus();
      const listener = vi.fn();
      
      bus.once('test.event', listener);
      bus.emit('test.event', 'data1');
      bus.emit('test.event', 'data2');
      
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith('data1');
    });

    it('once 监听器触发后应该自动移除', () => {
      const bus = new EventBus();
      const listener = vi.fn();
      
      bus.once('test.event', listener);
      bus.emit('test.event', 'data1');
      
      const normalListener = vi.fn();
      bus.on('test.event', normalListener);
      bus.emit('test.event', 'data2');
      
      expect(listener).toHaveBeenCalledTimes(1);
      expect(normalListener).toHaveBeenCalledTimes(1);
    });
  });

  describe('自定义分隔符', () => {
    it('应该支持自定义分隔符', () => {
      const bus = new EventBus('/');
      const listener = vi.fn();
      
      bus.on('user/login', listener);
      bus.emit('user/login', 'Alice');
      
      expect(listener).toHaveBeenCalledWith('Alice');
    });

    it('自定义分隔符应该支持通配符', () => {
      const bus = new EventBus('/');
      const listener = vi.fn();
      
      bus.on('user/*', listener);
      bus.emit('user/login', 'Alice');
      bus.emit('user/logout', 'Alice');
      
      expect(listener).toHaveBeenCalledTimes(2);
    });
  });

  describe('错误处理', () => {
    it('监听器抛出错误不应影响其他监听器', () => {
      const bus = new EventBus();
      const badListener = vi.fn(() => {
        throw new Error('Test error');
      });
      const goodListener = vi.fn();
      
      bus.on('test.event', badListener);
      bus.on('test.event', goodListener);
      
      expect(() => bus.emit('test.event', 'data')).not.toThrow();
      expect(goodListener).toHaveBeenCalledTimes(1);
    });
  });
});
