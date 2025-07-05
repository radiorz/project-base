// 函数重载声明

// 实现函数，明确 this 类型
export function clone(this: any, object?: any) {
  const obj = object ?? this;
  return JSON.parse(JSON.stringify(obj));
}
