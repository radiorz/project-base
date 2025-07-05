import _ from 'lodash';

// 定义一个类型别名，用于描述映射对象的类型
type OptionsMap = Record<string, string>;

/**
 * 根据提供的映射将对象的属性值转换到一个新的对象中。
 * @param obj 原始对象
 * @param map 属性映射，键是新对象的属性名，值是原始对象的属性路径
 * @returns 转换后的对象
 * @example 
 * const originalObject = {
 *   name: 'John',
 *   age: 30,
 *   address: {
 *     city: 'New York',
 *     zip: '10001'
 *   }
 * };
 *
 * const map = {
 *   fullName: 'name',
 *   city: 'address.city',
 *   zipCode: 'address.zip'
 * };
 *
 * const transformedObject = transformObjectByOptionsMap(originalObject, map);
 * console.log(transformedObject);
 * // 输出: { fullName: 'John', city: 'New York', zipCode: '10001' }
 }
 */
export function transformObjectByOptionsMap(obj: Record<string, any>, map: OptionsMap): Record<string, any> {
  const transformedObj: Record<string, any> = {};

  // 使用 Object.entries 遍历映射对象的键值对
  Object.entries(map).forEach(([newKey, path]) => {
    // 使用 lodash 的 get 函数安全地获取路径对应的值
    transformedObj[newKey] = _.get(obj, path);
  });

  return transformedObj;
}
