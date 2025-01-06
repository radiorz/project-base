export function params(template: string, payload: any) {
  const result = template.replace(/{(.*?)}/g, (match, key) => {
    // 从 payload 对象中获取对应的值
    return payload[key] || match; // 如果找不到对应的键，则保留原始的占位符
  });
  return result;
}
