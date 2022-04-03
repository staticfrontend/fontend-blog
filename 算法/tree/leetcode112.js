/**
 * 题号112：路径总和
 * 解题思路：
     用深度优先遍历，把当前节点的值相加，得到当前节点值的和
     遍历到叶子节点，判断当前叶子节点的值之和是否等于目标值
 */

const hasPathSum = (root, sum) => {
  if (!root) return false;

  let res = false;
  const dfs = (n,  total) => {
    console.log(n.val, total);

    // 判断叶子节点
    if (!n.left && !n.right && total === sum) {
      res = true;
    }

    // total 保存当前路径的节点值之和
    if (n.left) dfs(n.left, s + n.left.val);
    if (n.right) dfs(n.right, s + n.right.val);
  }

  dfs(root, sum);
  return res;
}

// 时间复杂度O(n)
// 空间复杂度O(n)：使用递归，形成调用堆栈，空间复杂度为O(n)