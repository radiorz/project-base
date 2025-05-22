import { it, expect } from 'vitest';
import { isStringInEnum } from './enum';
it('isStringInEnum', async () => {
  enum TheEnum {
    a = 'a',
    b = 'b',
  }
  expect(isStringInEnum('a', TheEnum)).toBe(true);
});
