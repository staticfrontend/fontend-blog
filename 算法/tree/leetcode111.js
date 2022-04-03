/**
 * 题号111：二叉树的最小深度
 * 解题思路：
    可以使用深度优先遍历，但是使用广度优先遍历节省性能
    在广度优先遍历中，遇到叶子节点，停止遍历，返回节点层级
 */

var minDepth = function (root) {
  if (!root) return 0;

  const q = [[root, 1]]; // 将队列元素加上层级level
  while (q.length) {
    const [head, level] = q.shift();
    console.log(head.val, level);
    
    // 遇到叶子节点，返回层级不继续遍历
    if (!head.left && !head.right) {
      return level;
    }

    // 将孩子节点入队
    // if (head.left) q.push(head.left);
    // if (head.right) q.push(head.right);
    // 加上层级
    if (head.left) q.push([head.left, level + 1]);
    if (head.right) q.push([head.right, level + 1]);
  }
}

// 时间复杂度O(n)
// 空间复杂度O(n)：队列q，最坏情况下q装满所有的树节点