/**
 * 移除 npm 包名中的 scope 部分
 * @param name 可能包含 scope 的包名，如 @scope/package-name
 * @returns 移除 scope 后的包名，如 package-name
 */
export function deleteScope(name: string): string {
  // 检查输入是否为空
  if (!name) {
    return name;
  }
  
  // 使用正则表达式匹配 @scope/package-name 格式的字符串
  const match = name.match(/^@([^/]+)\/(.+)$/);
  
  // 如果匹配成功，返回包名部分（第二个捕获组）
  if (match && match[2]) {
    return match[2];
  }
  
  // 如果不匹配 scope 格式，直接返回原字符串
  return name;
}

/**
 * 示例用法：
 * killScope('@tikkhun/release') // 返回 'release'
 * killScope('package-name')     // 返回 'package-name'
 * killScope('')                 // 返回 ''
 */
