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
