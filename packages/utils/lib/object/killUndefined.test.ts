import { expect, it } from 'vitest';
import { killUndefined } from './killUndefined';

it('killUndefined', () => {
  const origin = {
    a: undefined,
    b: 123,
    c: [1, 2, undefined],
    d: {
      a: undefined,
      b: 123,
    },
  };
  const result = killUndefined(origin);
  expect('a' in result).toBe(false);
  expect('b' in result).toBe(true);
  expect('c' in result).toEqual(true);
  expect(result.c).toEqual([1, 2]);
  expect('a' in result.d).toBe(false);
  expect('b' in result.d).toBe(true);
});
