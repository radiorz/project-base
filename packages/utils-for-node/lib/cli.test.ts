import { it, expect } from 'vitest';
import { isInstalled } from './cli';

it('isInstalled', async () => {
  const is7zInstalled = await isInstalled('7z');
  expect(is7zInstalled).toBe(true);
});
