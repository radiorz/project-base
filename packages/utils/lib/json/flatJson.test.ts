import { it, expect } from 'vitest';
import { flatJson } from './flatJson';
it('flatJson', async () => {
  const originJson = {
    a: { b: { c: 123, d: { e: 123 } } },
  };
  const flattedJson = flatJson({ data: originJson });
  expect(flattedJson['a.b.c']).toBe(123);
  expect(flattedJson['a.b.d.e']).toBe(123);
});
