import { it, expect } from 'vitest';
import { listToJson } from './listToJson';
it('listToJson', async () => {
  const originJson = {
    '777__a789': 'a789',
    '777__777': 777,
    '777__888': 888,
  };
  const json = listToJson({
    delimiter: '__',
    list: Object.entries(originJson).map(([key, value]) => {
      return {
        key,
        value,
      };
    }),
  });
  console.log(`json`, json['777']['888']);
  console.log(`json`, json);
  expect(json['777']['888']).toBe(888);
  expect(json['777']['777']).toBe(777);
});
