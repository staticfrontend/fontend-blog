/**
 * 二叉树-后序遍历
 */

const bt = require('./binaryTree');

const postoder = (root) => {
  if (!root) return;

  // 先访问左子树遍历
  postoder(root.left);

  // 访问右子树遍历
  postoder(root.right);

  // 访问根节点
  console.log(root.val);
}

postoder(bt);