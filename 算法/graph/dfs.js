/**
 * 图的深度优先遍历
 */
const graph = require('./graph');

// 记录访问过的节点
const visited = new Set();

const dfs = (n) => {
  console.log(n);

  visited.add(n);
  // 遍历n的相邻节点
  graph[n].forEach(v => {
    // 没有访问过的相邻节点递归
    if (!visited.has(v)) {
      dfs(v);
    }
  });
}

dfs(2);

// 输出 2 0 1 3