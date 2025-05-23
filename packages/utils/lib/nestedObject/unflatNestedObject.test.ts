import { it, expect } from 'vitest';
import { unflatJson } from './unflatJson';
it('unflatJson', async () => {
  const originJson = {
    'a.b.c': 123,
    'a.b.d.e': 456,
  };
  const unflattedJson = unflatJson({ data: originJson });
  expect(unflattedJson.a.b.c).toBe(123);
  expect(unflattedJson.a.b.d.e).toBe(456);
});
