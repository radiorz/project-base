import { it, expect } from 'vitest';
import { flatNestedObject } from './flatNestedObject';
it('flatNestedObject', async () => {
  const originJson = {
    a: { b: { c: 123, d: { e: 123 } } },
  };
  const flattedObject = flatNestedObject({ data: originJson });
  expect(flattedObject['a.b.c']).toBe(123);
  expect(flattedObject['a.b.d.e']).toBe(123);
});
