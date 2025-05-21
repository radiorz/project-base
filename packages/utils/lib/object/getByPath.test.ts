import { expect, it } from 'vitest';
import { getByPath } from './getByPath';
// 扩展 Object 接口，添加 clone 方法
declare global {
  interface Object {
    getByPath: Function;
  }
}

it('getByPath', () => {
  const origin = {
    a: undefined,
    b: 123,
    c: [1, 2, undefined],
    d: {
      a: undefined,
      b: 123,
    },
  };

  // Object.prototype.getByPath = getByPath;

  expect(getByPath(origin, 'b')).toBe(123);
  expect(getByPath(origin, 'c.1')).toBe(2);
  expect(getByPath(origin, 'd.b')).toBe(123);
});
