import { describe, it, expect } from 'vitest';
import { trimTrailingUndefined } from './trimTrailingUndefined';

describe('trimTrailingUndefined', () => {
  it('should return empty array when input is empty', () => {
    expect(trimTrailingUndefined([])).toEqual([]);
  });

  it('should return same array when no trailing undefined', () => {
    const input = [1, 2, 3];
    expect(trimTrailingUndefined(input)).toEqual([1, 2, 3]);
  });

  it('should trim single trailing undefined', () => {
    const input = [1, 2, undefined];
    expect(trimTrailingUndefined(input)).toEqual([1, 2]);
  });

  it('should trim multiple trailing undefined', () => {
    const input = [1, 2, undefined, undefined];
    expect(trimTrailingUndefined(input)).toEqual([1, 2]);
  });

  it('should not trim undefined in middle of array', () => {
    const input = [1, undefined, 2];
    expect(trimTrailingUndefined(input)).toEqual([1, undefined, 2]);
  });

  it('should handle all undefined elements', () => {
    const input = [undefined, undefined, undefined];
    expect(trimTrailingUndefined(input)).toEqual([]);
  });

  it('should handle string "undefined" as value (not actual undefined)', () => {
    const input = [1, 2, 'undefined'];
    expect(trimTrailingUndefined(input)).toEqual([1, 2, 'undefined']);
  });

  it('should handle mixed types', () => {
    const input = ['a', 1, true, undefined];
    expect(trimTrailingUndefined(input)).toEqual(['a', 1, true]);
  });
});
