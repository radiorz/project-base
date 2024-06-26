import { expect, it } from 'vitest';
import { killUndefined } from './object';

it('killUndefined', () => {
  const a = { a: undefined, b: 123 };
  const b = killUndefined(a);
  expect('a' in b).toBe(false);
  expect('b' in b).toBe(true);
});
