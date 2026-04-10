class RadixTreeNode {
  key: string;
  children: RadixTreeNode[];
  listeners: Set<Function>;

  constructor(key: string = '') {
    this.key = key;
    this.children = [];
    this.listeners = new Set();
  }
}

class RadixTree {
  root: RadixTreeNode;
  private separator: string;

  constructor(separator: string = '.') {
    this.root = new RadixTreeNode();
    this.separator = separator;
  }

  private findCommonPrefix(a: string, b: string): number {
    let i = 0;
    while (i < a.length && i < b.length && a[i] === b[i]) {
      i++;
    }
    return i;
  }

  insert(path: string, listener: Function): void {
    const parts = path.split(this.separator);
    let node = this.root;

    for (const part of parts) {
      let found = false;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        const commonLen = this.findCommonPrefix(part, child.key);

        if (commonLen === child.key.length) {
          if (commonLen === part.length) {
            node = child;
            found = true;
            break;
          }
          const newNode = new RadixTreeNode(part.slice(commonLen));
          newNode.listeners = new Set();
          child.children.push(newNode);
          node = newNode;
          found = true;
          break;
        }

        if (commonLen > 0) {
          const midNode = new RadixTreeNode(part.slice(0, commonLen));
          child.key = child.key.slice(commonLen);
          midNode.children.push(child);
          node.children[i] = midNode;

          if (commonLen < part.length) {
            const newNode = new RadixTreeNode(part.slice(commonLen));
            midNode.children.push(newNode);
            node = newNode;
          } else {
            node = midNode;
          }
          found = true;
          break;
        }
      }

      if (!found) {
        const newNode = new RadixTreeNode(part);
        node.children.push(newNode);
        node = newNode;
      }
    }

    node.listeners.add(listener);
  }

  private collectListeners(
    node: RadixTreeNode,
    parts: string[],
    index: number,
    result: Set<Function>
  ): void {
    if (index === parts.length) {
      for (const listener of node.listeners) {
        result.add(listener);
      }
      return;
    }

    const part = parts[index];

    for (const child of node.children) {
      if (child.key === '*' || child.key === '**') {
        this.collectListeners(child, parts, index + 1, result);
        if (child.key === '**') {
          for (let i = index; i <= parts.length; i++) {
            this.collectListeners(child, parts, i, result);
          }
        }
      } else if (child.key === part) {
        this.collectListeners(child, parts, index + 1, result);
      } else {
        const commonLen = this.findCommonPrefix(part, child.key);
        if (commonLen === child.key.length) {
          this.collectListeners(child, parts, index + 1, result);
        }
      }
    }
  }

  search(path: string): Set<Function> {
    const result = new Set<Function>();
    const parts = path.split(this.separator);
    this.collectListeners(this.root, parts, 0, result);
    return result;
  }

  remove(path: string, listener?: Function): void {
    const parts = path.split(this.separator);
    this.removeRecursive(this.root, parts, 0, listener);
  }

  private removeRecursive(
    node: RadixTreeNode,
    parts: string[],
    index: number,
    listener?: Function
  ): boolean {
    if (index === parts.length) {
      if (listener) {
        node.listeners.delete(listener);
      } else {
        node.listeners.clear();
      }
      return node.listeners.size === 0 && node.children.length === 0;
    }

    const part = parts[index];
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      if (child.key === part || child.key === '*' || child.key === '**') {
        if (this.removeRecursive(child, parts, index + 1, listener)) {
          node.children.splice(i, 1);
          return node.listeners.size === 0 && node.children.length === 0;
        }
      }
    }

    return false;
  }

  printTree(): void {
    this.printNode(this.root, '');
  }

  private printNode(node: RadixTreeNode, prefix: string): void {
    const hasListeners = node.listeners.size > 0;
    const displayKey = node.key || '(root)';
    console.log(`${prefix}${displayKey}${hasListeners ? ` [${node.listeners.size} listener(s)]` : ''}`);

    const childPrefix = prefix + '  ';
    for (const child of node.children) {
      this.printNode(child, childPrefix);
    }
  }

  getTreeStructure(): any {
    return this.getNodeStructure(this.root);
  }

  private getNodeStructure(node: RadixTreeNode): any {
    return {
      key: node.key || '(root)',
      listeners: node.listeners.size,
      children: node.children.map(child => this.getNodeStructure(child))
    };
  }
}

export class EventBus {
  private tree: RadixTree;

  constructor(separator: string = '.') {
    this.tree = new RadixTree(separator);
  }

  on(event: string, listener: Function): void {
    this.tree.insert(event, listener);
  }

  off(event: string, listener?: Function): void {
    this.tree.remove(event, listener);
  }

  emit(event: string, ...args: any[]): void {
    const listeners = this.tree.search(event);
    for (const listener of listeners) {
      try {
        listener(...args);
      } catch (error) {
        console.error('Event listener error:', error);
      }
    }
  }

  once(event: string, listener: Function): void {
    const onceWrapper = (...args: any[]) => {
      listener(...args);
      this.off(event, onceWrapper);
    };
    this.on(event, onceWrapper);
  }

  printTree(): void {
    console.log('\n=== Radix Tree Structure ===');
    this.tree.printTree();
    console.log('============================\n');
  }

  getTreeStructure(): any {
    return this.tree.getTreeStructure();
  }
}

export default EventBus;
