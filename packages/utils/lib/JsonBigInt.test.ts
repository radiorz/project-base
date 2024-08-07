import { it, expect } from 'vitest';
import { DEFAULT_JSON_BIGINT_OPTIONS, JsonBigInt } from './JsonBigInt';

it('jsonbigint is work', () => {
  const jsonBigInt = new JsonBigInt();
  const origin = {
    a: 132n,
  };
  const str = jsonBigInt.stringify(origin);
  expect(str).toBe(
    JSON.stringify({
      a: `${DEFAULT_JSON_BIGINT_OPTIONS.magicString}132${DEFAULT_JSON_BIGINT_OPTIONS.magicString}`,
    }),
  );
  const json = jsonBigInt.parse(str);
  console.log(`json`, json);
  expect(typeof json.a).toBe('bigint');
  expect(json.a).toBe(origin.a);
});
