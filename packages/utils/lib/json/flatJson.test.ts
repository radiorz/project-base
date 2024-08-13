import { it, expect } from 'vitest';
import { flatJson } from './flatJson';
it('flatJson', async () => {
  const originJson = {
    a: { b: { c: 123 } },
  };
  expect(flatJson({ data: originJson })['a.b.c']).toBe(123);
});
