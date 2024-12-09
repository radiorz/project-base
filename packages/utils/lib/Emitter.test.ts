import { describe, test, expect, vi, beforeEach } from 'vitest';
import { Emitter } from './Emitter';

describe('Emitter', () => {
  let emitter: Emitter;

  beforeEach(() => {
    emitter = new Emitter();
  });

  describe('on', () => {
    test('should register and trigger event listener', () => {
      const callback = vi.fn();
      emitter.on('test', callback);
      emitter.emit('test', 'data');
      expect(callback).toHaveBeenCalledWith('data');
    });

    test('should handle multiple listeners for same event', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      emitter.on('test', callback1);
      emitter.on('test', callback2);
      emitter.emit('test', 'data');
      expect(callback1).toHaveBeenCalledWith('data');
      expect(callback2).toHaveBeenCalledWith('data');
    });

    test('should support AbortSignal', () => {
      const callback = vi.fn();
      const controller = new AbortController();

      emitter.on('test', callback, controller.signal);
      controller.abort();
      emitter.emit('test', 'data');

      expect(callback).not.toHaveBeenCalled();
    });

    test('should not register if signal is already aborted', () => {
      const callback = vi.fn();
      const controller = new AbortController();
      controller.abort();

      emitter.on('test', callback, controller.signal);
      emitter.emit('test', 'data');

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('once', () => {
    test('should trigger listener only once', () => {
      const callback = vi.fn();
      emitter.once('test', callback);

      emitter.emit('test', 'first');
      emitter.emit('test', 'second');

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('first');
    });

    test('should work with multiple once listeners', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      emitter.once('test', callback1);
      emitter.once('test', callback2);

      emitter.emit('test', 'data');

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });
  });

  describe('off', () => {
    test('should remove specific listener', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      emitter.on('test', callback1);
      emitter.on('test', callback2);
      emitter.off('test', callback1);

      emitter.emit('test', 'data');

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledWith('data');
    });

    test('should handle removing non-existent listener', () => {
      const callback = vi.fn();
      // 不应抛出错误
      expect(() => emitter.off('test', callback)).not.toThrow();
    });
  });

  describe('emit', () => {
    test('should pass multiple arguments to listeners', () => {
      const callback = vi.fn();
      emitter.on('test', callback);

      emitter.emit('test', 'arg1', 'arg2', 3);

      expect(callback).toHaveBeenCalledWith('arg1', 'arg2', 3);
    });

    test('should handle non-existent event', () => {
      // 不应抛出错误
      expect(() => emitter.emit('nonexistent', 'data')).not.toThrow();
    });

    test('should execute listeners in order of registration', () => {
      const results: number[] = [];

      emitter.on('test', () => results.push(1));
      emitter.on('test', () => results.push(2));
      emitter.on('test', () => results.push(3));

      emitter.emit('test');

      expect(results).toEqual([1, 2, 3]);
    });
  });
});
