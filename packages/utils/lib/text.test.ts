import { it, expect } from 'vitest';
import { replaceParams } from './text';

it('replaceParams', () => {
  expect(replaceParams('{app}', { app: 'hahah' })).toBe('hahah');
});
