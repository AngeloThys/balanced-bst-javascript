class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.root = this.buildTree(
      this.prepareArray(array),
      0,
      this.prepareArray(array).length - 1,
    );
  }

  prepareArray(array) {
    return [...new Set(array.toSorted((a, b) => a - b))];
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
    if (typeof value !== "number") {
      throw new Error("Not a number");
    }

    this.insertRecursion(value);
  }

  insertRecursion(value, node = this.root) {
    if (value === node.value) {
      throw new Error("Value already present");
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
    if (typeof value !== "number") {
      throw new Error("Not a number");
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
    if (typeof value !== "number") {
      throw new Error("not a number");
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

  levelOrder(callback = (node) => node.value) {
    const queue = [this.root];
    const values = [];
    let node = null;

    while (queue.length > 0) {
      node = queue.shift();

      values.push(callback(node));

      if (node.left !== null) {
        queue.push(node.left);
      }
      if (node.right !== null) {
        queue.push(node.right);
      }
    }

    return values;
  }

  levelOrderRecursive(callback = (node) => node.value, queue = [this.root]) {
    let node = queue.shift();
    // base case
    if (queue.length === 0 && node.left === null && node.right === null) {
      return [callback(node)];
    }

    // recursive case
    if (node.left !== null) {
      queue.push(node.left);
    }
    if (node.right !== null) {
      queue.push(node.right);
    }

    return [callback(node)].concat(this.levelOrderRecursive(callback, queue));
  }

  inOrder(callback = (node) => node.value, node = this.root) {
    let arr = [];
    // base case
    if (node === null) {
      return [];
    }

    // recursive case
    arr = arr.concat(this.inOrder(callback, node.left));
    arr.push(callback(node));
    arr = arr.concat(this.inOrder(callback, node.right));

    return arr;
  }

  preOrder(callback = (node) => node.value, node = this.root) {
    let arr = [];
    // base case
    if (node === null) {
      return [];
    }

    // recursive case
    arr.push(callback(node));
    arr = arr.concat(this.preOrder(callback, node.left));
    arr = arr.concat(this.preOrder(callback, node.right));

    return arr;
  }

  postOrder(callback = (node) => node.value, node = this.root) {
    let arr = [];
    // base case
    if (node === null) {
      return [];
    }

    // recursive case
    arr = arr.concat(this.postOrder(callback, node.left));
    arr = arr.concat(this.postOrder(callback, node.right));
    arr.push(callback(node));

    return arr;
  }

  height(node = this.root, count = 0) {
    // base case
    if (node === null) {
      return --count;
    }

    // recursive case
    let left = this.height(node.left, count + 1);
    let right = this.height(node.right, count + 1);

    // return highest value
    return left >= right ? left : right;
  }

  height2(node = this.root, count = 0) {
    if (node === null) {
      return count;
    }

    let left = count;
    let right = count;

    if (node.left !== null) {
      left = this.height2(node.left, count + 1);
    }
    if (node.right !== null) {
      right = this.height2(node.right, count + 1);
    }

    return left >= right ? left : right;
  }

  depth(target, node = this.root, count = 0) {
    if (node === null) {
      throw new Error("Node not in tree");
    }

    if (node.value > target.value) {
      return this.depth(target, node.left, ++count);
    }
    if (node.value < target.value) {
      return this.depth(target, node.right, ++count);
    }

    return count;
  }

  isNodeBalanced = (node) => {
    let leftHeight = this.height2(node.left);
    let rightHeight = this.height2(node.right);
    let difference = Math.abs(leftHeight - rightHeight);

    return difference <= 1;
  };

  isBalanced() {
    return !this.levelOrder(this.isNodeBalanced).includes(false);
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
}
