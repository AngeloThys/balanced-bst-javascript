class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.root = this.buildTree(this.prepareArray(array), 0, this.prepareArray(array).length - 1);
  }

  prepareArray(array) {
    return [... new Set(array.toSorted((a, b) => a - b))];
  }

  buildTree(array, start, end) {
    if (start > end) {
      return null;
    }

    let mid = Math.floor((start + end) / 2);
    let root = new Node(array[mid]);

    root.left = this.buildTree(array, start, mid - 1);
    root.right = this.buildTree(array, mid + 1, end);

    return root;
  }

  insert(value) {
    if (typeof value !== 'number') {
      throw new Error('Not a number');
    }

    this.insertRecursion(value);
  }

  insertRecursion(value, node = this.root) {
    if (value === node.value) {
      throw new Error('Value already present');
    }

    if (value > node.value) {
      if (node.right === null) {
        node.right = new Node(value);
      } else {
        this.insertRecursion(value, node.right);
      }
    } else {
      if (node.left === null) {
        node.left = new Node(value);
      } else {
        this.insertRecursion(value, node.left);
      }
    }
  }

  delete(value) {
    if (typeof value !== 'number') {
      throw new Error('Not a number');
    }

    this.root = this.deleteRecursion(value);
  }

  deleteRecursion(value, node = this.root) {
    // base recursion case
    if (node === null) {
      return null;
    }

    // recursive traversal of the tree
    if (value > node.value) {
      node.right = this.deleteRecursion(value, node.right);
      return node;
    }
    if (value < node.value) {
      node.left = this.deleteRecursion(value, node.left);
      return node;
    }

    // Handle each case of node (leaf, 1child, 2children)
    if (node.right === null) {
      return node.left;
    }
    if (node.left === null) {
      return node.right;
    }

    let replacementParent = node;
    let replacement = node.right;

    while (replacement.left !== null) {
      replacementParent = replacement;
      replacement = replacement.left;
    }

    if (replacementParent === node) {
      replacementParent.right = replacement.right;
    } else {
      replacementParent.left = replacement.right;
    }

    node.value = replacement.value;

    return node;
  }

  find(value) {
    if (typeof value !== 'number') {
      throw new Error('not a number');
    }

    return this.findRecursive(value);
  }

  findRecursive(value, node = this.root) {
    // base recursive case
    if (node === null) {
      return null;
    }

    // recursive traversal until value
    if (value > node.value) {
      return this.findRecursive(value, node.right);
    }
    if (value < node.value) {
      return this.findRecursive(value, node.left);
    }

    // return node when value matches
    return node;
  }
}

function prettyPrint(node, prefix = "", isLeft = true) {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

