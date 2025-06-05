import { isBuffer } from './isBuffer';
import { it, expect } from 'vitest';
it('should return false for non-Buffer objects', () => {
  expect(isBuffer({})).toBe(false);
  expect(isBuffer([])).toBe(false);
  expect(isBuffer('string')).toBe(false);
  expect(isBuffer(123)).toBe(false);
  expect(isBuffer(null)).toBe(false);
  expect(isBuffer(undefined)).toBe(false);
});

it('should return true for Buffer objects', () => {
  const buffer = Buffer.from('test');
  expect(isBuffer(buffer)).toBe(true);
});
