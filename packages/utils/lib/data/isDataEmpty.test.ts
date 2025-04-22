import { isDataEmpty } from './isDataEmpty';
import { describe, it, expect } from 'vitest';
describe('isDataEmpty', () => {
  // 测试 null 和 undefined
  it('should return true for null', () => {
    expect(isDataEmpty(null)).toBe(true);
  });

  it('should return true for undefined', () => {
    expect(isDataEmpty(undefined)).toBe(true);
  });

  // 测试数字 0
  it('should return true for number 0', () => {
    expect(isDataEmpty(0)).toBe(true);
  });

  // 测试空字符串
  it('should return true for empty string', () => {
    expect(isDataEmpty('')).toBe(true);
  });

  // 测试空数组
  it('should return true for empty array', () => {
    expect(isDataEmpty([])).toBe(true);
  });

  // 测试包含空字符串的数组
  it('should return true for array with single empty string', () => {
    expect(isDataEmpty([''])).toBe(true);
  });

  // 测试空对象
  it('should return true for empty object', () => {
    expect(isDataEmpty({})).toBe(true);
  });

  // 测试函数
  it('should return true for function', () => {
    expect(isDataEmpty(() => {})).toBe(true);
  });

  // 测试非空数据
  it('should return false for non-empty data', () => {
    expect(isDataEmpty('hello')).toBe(false);
    expect(isDataEmpty(1)).toBe(false);
    expect(isDataEmpty([1])).toBe(false);
    expect(isDataEmpty({ key: 'value' })).toBe(false);
  });
});
