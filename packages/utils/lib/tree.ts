export interface TreeNode {
  id: string;
  parentId: string | null;
  children?: TreeNode[];
  [props: string]: any;
}
/**
 * 从数组建立树
 * @param data
 * @returns
 */
export function buildTree(data: TreeNode[]) {
  const tree: TreeNode[] = [];

  const map: { [id: string]: TreeNode } = {};

  // 创建映射表
  data.forEach((node) => {
    map[node.id] = { ...node, children: [] };
  });

  // 构建树
  data.forEach((node) => {
    if (!node.parentId) {
      return;
    }
    const parent = map[node.parentId];
    if (parent) {
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(map[node.id]);
    } else {
      tree.push(map[node.id]);
    }
  });

  return tree;
}

// 深度优先的搜索
export function findNodeByIdDFS(tree: TreeNode, id: string): TreeNode | null {
  // 检查当前节点
  if (tree.id === id) {
    return tree;
  }

  // 如果当前节点有子节点，递归搜索
  if (tree.children) {
    for (const child of tree.children) {
      const result = findNodeByIdDFS(child, id);
      if (result) {
        return result;
      }
    }
  }

  // 如果没有找到匹配的节点，返回 null
  return null;
}
// 广度优先搜索
export function findNodeByIdBFS(tree: TreeNode, id: string): TreeNode | null {
  // 创建一个队列并将根节点加入队列
  const queue: TreeNode[] = [tree];

  while (queue.length > 0) {
    const currentNode = queue.shift()!;

    // 检查当前节点
    if (currentNode.id === id) {
      return currentNode;
    }

    // 将子节点加入队列
    if (currentNode.children) {
      queue.push(...currentNode.children);
    }
  }

  // 如果没有找到匹配的节点，返回 null
  return null;
}
