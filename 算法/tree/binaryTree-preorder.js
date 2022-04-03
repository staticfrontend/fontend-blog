/**
 * 二叉树-先序遍历
 */

const bt = require('./binaryTree');

const preoder = (root) => {
  if (!root) return;

  // 先访问根节点
  console.log(root.val);

  // 访问左子树递归遍历
  preoder(root.left);

  // 访问右子树递归遍历
  preoder(root.right);
}

preoder(bt);