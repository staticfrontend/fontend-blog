/**
 * 题号104：二叉树的最大深度
 * 解题思路：
    求最大深度，用深度优先遍历
    深度优先遍历记录每个节点所在的层级，最大的层级就是最大深度
 */

var maxDepth = function (root) {
  let maxLength = 0;
  const dfs = (n, level) => {
    if (!n) return;

    console.log(n.val, level);
    
    if (!n.left && !n.right) {
      // 当前节点为叶子节点，刷新最大层级（节省性能）
      maxLength = Math.max(maxLength, level);
    }
    
    // 遇到孩子节点，把当前level加1
    dfs(n.left, level + 1);
    dfs(n.right, level + 1);
  }

  dfs(root, 1);

  return maxLength;
}

// 时间复杂度：每个树节点都遍历了一次，时间复杂度O(n)
// 空间复杂度：深度优先遍历使用了递归，递归一直占用变量n和level，所以递归了多少次就是空间复杂度；最好情况下遍历log2n次，最坏情况下遍历n次
