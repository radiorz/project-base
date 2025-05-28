/**
 * 测试用例覆盖了各种输入情况：

空数组
单元素平面数组
多元素平面数组
单层嵌套数组
混合平面和嵌套数组
多层嵌套数组
字符串元素
包含空数组的情况
每个测试用例验证了函数的不同行为：

对于平面数组，直接返回包含该数组的数组
对于嵌套数组，生成所有可能的组合
对于混合输入，正确处理平面和嵌套元素的组合
对于多层嵌套，只展开第一层嵌套
测试用例数量控制在9个，覆盖了主要功能路径和边界情况
 */
import { flattenNestedArray } from './flattenNestedArray';
import { describe, test, expect } from 'vitest';
describe('flattenNestedArray', () => {
  test('should handle empty array', () => {
    expect(flattenNestedArray([])).toEqual([[]]);
  });

  test('should handle flat array with single element', () => {
    expect(flattenNestedArray([1])).toEqual([[1]]);
  });

  test('should handle flat array with multiple elements', () => {
    expect(flattenNestedArray([1, 2, 3])).toEqual([[1, 2, 3]]);
  });

  test('should handle nested array with single array element', () => {
    expect(flattenNestedArray([[1, 2]])).toEqual([[1], [2]]);
  });

  test('should handle mixed flat and nested arrays', () => {
    expect(flattenNestedArray([1, [2, 3], 4])).toEqual([
      [1, 2, 4],
      [1, 3, 4],
    ]);
  });

  test('should handle multiple nested arrays', () => {
    expect(
      flattenNestedArray([
        [1, 2],
        [3, 4],
      ]),
    ).toEqual([
      [1, 3],
      [1, 4],
      [2, 3],
      [2, 4],
    ]);
  });

  test('should handle complex nested structure', () => {
    expect(flattenNestedArray([1, [2, [3, 4]], 5])).toEqual([
      [1, 2, 5],
      [1, [3, 4], 5],
    ]);
  });

  test('should handle string elements', () => {
    expect(flattenNestedArray(['a', ['b', 'c']])).toEqual([
      ['a', 'b'],
      ['a', 'c'],
    ]);
  });

  test('should handle empty nested arrays', () => {
    expect(flattenNestedArray([1, [], 2])).toEqual([[1, undefined, 2]]);
  });
});
