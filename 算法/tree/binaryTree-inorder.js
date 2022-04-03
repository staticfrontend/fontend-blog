/**
 * 二叉树-中序遍历
 */

const bt = require('./binaryTree');

const inoder = (root) => {
  if (!root) return;

  // 先访问左子树遍历
  inoder(root.left);

  // 访问根节点
  console.log(root.val);

  // 访问右子树遍历
  inoder(root.right);
}

inoder(bt);