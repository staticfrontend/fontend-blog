/**
 * 图的广度优先遍历
 */
const graph = require('./graph');

// 记录访问过的节点
const visited = new Set();
visited.add(2);

const bfs = (n) => {
  const q = [n];

  while (q.length) {
    const head = q.shift();
    console.log(head);

    // 遍历n的相邻节点
    graph[head].forEach(v => {
      // 没访问过的相邻节点入队
      if (!visited.has(v)) {
        q.push(v);
        visited.add(v);
      }
    });
  }
}

bfs(2);

// 输出 2 0 3 1