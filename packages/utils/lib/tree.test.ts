import { describe, expect, it } from 'vitest';
import { addAncestorIds, TreeNode } from './tree'; // 替换为你的文件路径

describe('addAncestorIds', () => {
  it('should correctly add ancestorIds to each node in a tree', () => {
    const tree = {
      id: 1,
      name: 'root',
      children: [
        {
          id: 2,
          name: 'child1',
          children: [
            { id: 3, name: 'grandchild1', children: [] },
            { id: 4, name: 'grandchild2', children: [] },
          ],
        },
        {
          id: 5,
          name: 'child2',
          children: [],
        },
      ],
    } as TreeNode<number>;

    const expectedTree = {
      id: 1,
      name: 'root',
      ancestorIds: [],
      children: [
        {
          id: 2,
          name: 'child1',
          ancestorIds: [1],
          children: [
            {
              id: 3,
              name: 'grandchild1',
              ancestorIds: [1, 2],
              children: [],
            },
            {
              id: 4,
              name: 'grandchild2',
              ancestorIds: [1, 2],
              children: [],
            },
          ],
        },
        {
          id: 5,
          name: 'child2',
          ancestorIds: [1],
          children: [],
        },
      ],
    } as TreeNode;

    const result = addAncestorIds(tree);
    expect(result).toEqual(expectedTree);
  });

  it('should handle an empty tree', () => {
    const tree = { id: 1, name: 'root', children: [] } as TreeNode;
    const expectedTree = { id: 1, name: 'root', ancestorIds: [], children: [] } as TreeNode;

    const result = addAncestorIds(tree);
    expect(result).toEqual(expectedTree);
  });

  it('should handle a tree with missing children', () => {
    const tree = { id: 1, name: 'root' } as TreeNode;
    const expectedTree = { id: 1, name: 'root', ancestorIds: [] } as TreeNode;

    const result = addAncestorIds(tree);
    expect(result).toEqual(expectedTree);
  });
});
