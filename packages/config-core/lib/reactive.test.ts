import { describe, it, expect, vi } from 'vitest';
import { createReactiveObject } from './reactive'; // 替换为你的文件路径

describe('createReactiveObject', () => {
  it('should create a reactive object and trigger onChange when property changes', () => {
    const onChange = vi.fn();
    const target = { a: 1 };
    const reactiveObj = createReactiveObject(target, onChange);

    reactiveObj.a = 2;

    expect(onChange).toHaveBeenCalledWith('a', 2);
    expect(reactiveObj.a).toBe(2);
  });

  it('should handle nested objects and trigger onChange correctly', () => {
    const onChange = vi.fn();
    const target = { a: { b: 1 } };
    const reactiveObj = createReactiveObject(target, onChange);

    reactiveObj.a.b = 2;

    expect(onChange).toHaveBeenCalledWith('a.b', 2);
    expect(reactiveObj.a.b).toBe(2);
  });

  it('should handle array and not bind array methods', () => {
    const onChange = vi.fn();
    const target = { arr: [1, 2, 3] };
    const reactiveObj = createReactiveObject(target, onChange);

    reactiveObj.arr.push(4);

    expect(onChange).toHaveBeenCalled();
    expect(reactiveObj.arr).toEqual([1, 2, 3, 4]);
  });

  it('should handle Map and Set objects correctly', () => {
    const onChange = vi.fn();
    const target = { map: new Map([['key', 'value']]), set: new Set([1, 2]) };
    const reactiveObj = createReactiveObject(target, onChange);

    reactiveObj.map.set('newKey', 'newValue');
    reactiveObj.set.add(3);

    expect(onChange).not.toHaveBeenCalled();
    expect(reactiveObj.map.get('newKey')).toBe('newValue');
    expect(reactiveObj.set.has(3)).toBe(true);
  });

  it('should not trigger onChange when the value does not change', () => {
    const onChange = vi.fn();
    const target = { a: 1 };
    const reactiveObj = createReactiveObject(target, onChange);

    reactiveObj.a = 1;

    expect(onChange).not.toHaveBeenCalled();
  });

  it('should handle object replacement correctly', () => {
    const onChange = vi.fn();
    const target: any = { a: { b: 1 } };
    const reactiveObj = createReactiveObject(target, onChange);

    reactiveObj.a = { c: 2 };

    expect(onChange).toHaveBeenCalledWith('a', { c: 2 });
    expect(reactiveObj.a).toEqual({ c: 2 });
  });

  // it('should handle complex nested structures', () => {
  //   const onChange = vi.fn();
  //   const target: any = {
  //     a: {
  //       b: [1, 2, { c: 3 }],
  //       d: new Map([['key', 'value']]),
  //       e: new Set([1, 2]),
  //     },
  //   };
  //   const reactiveObj = createReactiveObject(target, onChange);

  //   reactiveObj.a.b.push(4);
  //   reactiveObj.a.b[2].c = 4;
  //   reactiveObj.a.d.set('newKey', 'newValue');
  //   reactiveObj.a.e.add(3);

  //   expect(onChange).toHaveBeenCalledWith('a.b', [1, 2, { c: 4 }, 4]);
  //   expect(reactiveObj.a.b).toEqual([1, 2, { c: 4 }, 4]);
  //   expect(reactiveObj.a.d.get('newKey')).toBe('newValue');
  //   expect(reactiveObj.a.e.has(3)).toBe(true);
  // });

  it('should handle function properties correctly', () => {
    const onChange = vi.fn();
    const target = {
      a: () => 'function value',
      b: {
        c: () => 'nested function value',
      },
    };
    const reactiveObj = createReactiveObject(target, onChange);

    expect(reactiveObj.a()).toBe('function value');
    expect(reactiveObj.b.c()).toBe('nested function value');
  });
});
