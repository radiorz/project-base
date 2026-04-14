import type { NodeName } from './types';

/**
 * 校验节点名称是否合法.
 * @param name 节点名称字符串.
 * 设计原因: 约束路径格式,让层级推断与topic拼接保持确定性,避免歧义.
 */
export function isValidNodeName(name: string): name is NodeName {
  // 空字符串会导致根节点语义不清,并且破坏 split 结果.
  if (!name) return false;
  // 禁止以 / 开头或结尾,否则会产生空段,导致同一语义出现多种写法.
  if (name.startsWith('/') || name.endsWith('/')) return false;
  // 禁止连续 //,否则等价路径会出现多种表达,影响祖先判断与路由稳定性.
  if (name.includes('//')) return false;
  const parts = name.split('/');
  // 禁止 . 与 .. ,避免引入文件路径式的回退语义,破坏前缀匹配的层级推断.
  return parts.every((p) => p.length > 0 && p !== '.' && p !== '..');
}

/**
 * 获取父节点名称.
 * @param name 当前节点名称.
 * @returns 父节点名称,如果不存在父节点则返回 undefined.
 * 设计原因: parent 通过字符串截断即可得到,不需要额外存储树结构索引.
 */
export function getParentName(name: NodeName): NodeName | undefined {
  const index = name.lastIndexOf('/');
  // index <= 0 说明没有分隔符或分隔符在开头,此时不存在有效父节点.
  if (index <= 0) return undefined;
  return name.slice(0, index);
}

/**
 * 判断 ancestor 是否为 maybeDescendant 的祖先.
 * @param ancestor 可能的祖先节点名称.
 * @param maybeDescendant 可能的后代节点名称.
 * 设计原因: 通过字符串前缀关系即可确定祖先,避免构建树并降低运行时开销.
 */
export function isAncestorOf(ancestor: NodeName, maybeDescendant: NodeName): boolean {
  // 相等时不视为祖先,否则会导致自环语义,影响投递方向推断.
  if (ancestor === maybeDescendant) return false;
  return maybeDescendant.startsWith(ancestor + '/');
}

/**
 * 获取 name 到 maybeDescendant 路径上的直接子节点名称.
 * @param name 祖先节点名称.
 * @param maybeDescendant 可能的后代节点名称.
 * @returns 直接子节点名称,如果不是后代则返回 undefined.
 * 设计原因: 从后代路径中截取下一段,可用于建立最小跳转的路由或树关系.
 */
export function getDirectChildName(name: NodeName, maybeDescendant: NodeName): NodeName | undefined {
  if (!isAncestorOf(name, maybeDescendant)) return undefined;
  const rest = maybeDescendant.slice(name.length + 1);
  const nextSlash = rest.indexOf('/');
  // nextSlash === -1 说明后代就是直接子节点.
  if (nextSlash === -1) return maybeDescendant;
  return name + '/' + rest.slice(0, nextSlash);
}
